const TARGET_URL =
  'https://stream-upload.goofish.com/api/upload.api?_input_charset=utf-8&appkey=fleamarket';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

function buildCorsHeaders(origin, allowedOrigin) {
  if (!allowedOrigin) return {};
  if (origin && origin === allowedOrigin) {
    return {
      'access-control-allow-origin': allowedOrigin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
      vary: 'origin',
    };
  }
  return {};
}

function getOrigin(request) {
  return request.headers.get('origin') || '';
}

function sanitizeBaseName(name) {
  return String(name || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'image';
}

function extFromFile(file) {
  const name = String(file?.name || '');
  const extMatch = name.match(/\.([a-zA-Z0-9]+)$/);
  if (extMatch) return extMatch[1].toLowerCase();

  const mime = String(file?.type || '').toLowerCase();
  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/x-icon': 'ico',
  };
  return map[mime] || 'bin';
}

function generateServerFileName(file) {
  const ext = extFromFile(file);
  const now = new Date();
  const parts = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    '-',
    String(now.getUTCHours()).padStart(2, '0'),
    String(now.getUTCMinutes()).padStart(2, '0'),
    String(now.getUTCSeconds()).padStart(2, '0'),
  ];
  const ts = parts.join('');
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const base = sanitizeBaseName(file?.name || 'image');
  return `${base}-${ts}-${rand}.${ext}`;
}

function looksLikeUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const normalized = value.startsWith('//') ? `https:${value}` : value;
    const url = new URL(normalized);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch (_) {
    return false;
  }
}

function normalizeUrl(value) {
  if (typeof value !== 'string') return '';
  if (value.startsWith('//')) return `https:${value}`;
  return value;
}

function scoreKey(key) {
  const k = String(key || '').toLowerCase();
  if (/^(image|img|pic|picture|url|src|link|original|origin|download)/.test(k)) return 10;
  if (/(image|img|pic|url|src|link)/.test(k)) return 5;
  return 0;
}

function looksLikeImageUrl(value) {
  if (!looksLikeUrl(value)) return false;
  const s = normalizeUrl(value).toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?|#|$)/.test(s) ||
    /(?:image|img|pic|photo|original|upload)/.test(s);
}

function extractImageUrl(data) {
  let strongCandidate = '';
  let weakCandidate = '';

  function walk(node, parentKey = '') {
    if (strongCandidate) return;

    if (typeof node === 'string') {
      if (!looksLikeUrl(node)) return;
      const normalized = normalizeUrl(node);

      if (looksLikeImageUrl(normalized) || scoreKey(parentKey) >= 10) {
        strongCandidate = normalized;
        return;
      }

      if (!weakCandidate) {
        weakCandidate = normalized;
      }
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) walk(item, parentKey);
      return;
    }

    if (node && typeof node === 'object') {
      const entries = Object.entries(node).sort((a, b) => scoreKey(b[0]) - scoreKey(a[0]));
      for (const [key, value] of entries) {
        walk(value, key);
      }
    }
  }

  walk(data);
  return strongCandidate || weakCandidate || '';
}

async function verifyTurnstile(token, secret, remoteIp, expectedHostname) {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  body.set('idempotency_key', crypto.randomUUID());
  if (remoteIp) body.set('remoteip', remoteIp);

  const resp = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok || !data?.success) {
    return {
      ok: false,
      message: 'Turnstile 校验失败',
      detail: data,
    };
  }

  if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
    return {
      ok: false,
      message: 'Turnstile hostname 不匹配',
      detail: data,
    };
  }

  return { ok: true, detail: data };
}

function buildMarkdown(imageUrl, fileName) {
  const alt = sanitizeBaseName(fileName || 'image');
  return `![${alt}](${imageUrl})`;
}

export default async function onRequest(context) {
  const { request, env, clientIp } = context;
  const method = request.method.toUpperCase();
  const origin = getOrigin(request);
  const allowedOrigin = String(env.ALLOWED_ORIGIN || '').trim();
  const corsHeaders = buildCorsHeaders(origin, allowedOrigin);

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (method !== 'POST') {
    return json({ ok: false, message: 'Method Not Allowed' }, 405, corsHeaders);
  }

  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return json(
      { ok: false, message: '非法来源' },
      403,
      corsHeaders
    );
  }

  const turnstileSecret = String(env.TURNSTILE_SECRET_KEY || '').trim();
  const expectedHostname = String(env.TURNSTILE_EXPECTED_HOSTNAME || '').trim();

  if (!turnstileSecret) {
    return json(
      { ok: false, message: 'TURNSTILE_SECRET_KEY 未配置' },
      500,
      corsHeaders
    );
  }

  try {
    const form = await request.formData();

    const file = form.get('file');
    const inputCookie = String(form.get('cookie') || '').trim();
    const turnstileToken = String(form.get('cf-turnstile-response') || '').trim();

    if (!(file instanceof File)) {
      return json(
        { ok: false, message: '未检测到图片文件' },
        400,
        corsHeaders
      );
    }

    if (!file.type || !String(file.type).startsWith('image/')) {
      return json(
        { ok: false, message: '仅支持图片文件' },
        400,
        corsHeaders
      );
    }

    if (!inputCookie) {
      return json(
        { ok: false, message: '请填写 Cookie' },
        400,
        corsHeaders
      );
    }

    if (!turnstileToken) {
      return json(
        { ok: false, message: '请先完成人机验证' },
        400,
        corsHeaders
      );
    }

    if (file.size > 5.5 * 1024 * 1024) {
      return json(
        { ok: false, message: '图片过大，请控制在 5.5 MB 内' },
        413,
        corsHeaders
      );
    }

    const turnstileResult = await verifyTurnstile(
      turnstileToken,
      turnstileSecret,
      clientIp,
      expectedHostname
    );

    if (!turnstileResult.ok) {
      return json(
        {
          ok: false,
          message: turnstileResult.message,
          errorCodes: turnstileResult.detail?.['error-codes'] || [],
        },
        403,
        corsHeaders
      );
    }

    const serverFileName = generateServerFileName(file);

    const upstreamForm = new FormData();
    upstreamForm.append('file', file, serverFileName);
    upstreamForm.append('name', serverFileName);
    upstreamForm.append('folderId', '0');
    upstreamForm.append('appkey', 'fleamarket');

    const upstreamHeaders = new Headers();
    upstreamHeaders.set('accept', 'application/json, text/plain, */*');
    upstreamHeaders.set('cookie', inputCookie);
    upstreamHeaders.set('origin', 'https://author.goofish.com');
    upstreamHeaders.set('referer', 'https://author.goofish.com/');
    upstreamHeaders.set(
      'user-agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

    const upstreamResp = await fetch(TARGET_URL, {
      method: 'POST',
      headers: upstreamHeaders,
      body: upstreamForm,
      redirect: 'follow',
    });

    const contentType = upstreamResp.headers.get('content-type') || '';
    const rawText = await upstreamResp.text();

    let parsed = null;
    if (contentType.includes('application/json')) {
      parsed = JSON.parse(rawText);
    } else {
      try {
        parsed = JSON.parse(rawText);
      } catch (_) {
        parsed = { raw: rawText };
      }
    }

    if (!upstreamResp.ok) {
      return json(
        {
          ok: false,
          message: '上游上传接口返回错误',
          upstreamStatus: upstreamResp.status,
          upstream: parsed,
        },
        upstreamResp.status,
        corsHeaders
      );
    }

    const imageUrl = extractImageUrl(parsed);
    if (!imageUrl) {
      return json(
        {
          ok: false,
          message: '上传接口已返回，但未解析出图片直链',
          serverFileName,
          upstream: parsed,
        },
        502,
        corsHeaders
      );
    }

    return json(
      {
        ok: true,
        imageUrl,
        markdown: buildMarkdown(imageUrl, serverFileName),
        serverFileName,
      },
      200,
      corsHeaders
    );
  } catch (err) {
    return json(
      {
        ok: false,
        message: err?.message || String(err),
      },
      500,
      corsHeaders
    );
  }
}