const TARGET_URL =
  'https://stream-upload.goofish.com/api/upload.api?_input_charset=utf-8&appkey=fleamarket';

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
      'vary': 'origin',
    };
  }
  return {};
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('origin') || '';
  const allowedOrigin = (context.env.ALLOWED_ORIGIN || '').trim();
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(origin, allowedOrigin),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('origin') || '';
  const allowedOrigin = (env.ALLOWED_ORIGIN || '').trim();

  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return json(
      { ok: false, error: 'origin_not_allowed', message: '非法来源' },
      403,
      buildCorsHeaders(origin, allowedOrigin)
    );
  }

  try {
    const form = await request.formData();

    const file = form.get('file');
    const inputCookie = String(form.get('cookie') || '').trim();
    const fakeName = String(form.get('name') || '随便伪装的名.jpg').trim();

    if (!(file instanceof File)) {
      return json(
        { ok: false, error: 'missing_file', message: '未检测到文件字段 file' },
        400,
        buildCorsHeaders(origin, allowedOrigin)
      );
    }

    if (!inputCookie) {
      return json(
        { ok: false, error: 'missing_cookie', message: '请填写 Cookie' },
        400,
        buildCorsHeaders(origin, allowedOrigin)
      );
    }

    // 预留一点冗余，避免整体请求体撞到 6MB 上限
    if (file.size > 5.5 * 1024 * 1024) {
      return json(
        { ok: false, error: 'file_too_large', message: '文件过大，建议小于 5.5MB' },
        413,
        buildCorsHeaders(origin, allowedOrigin)
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append('file', file, file.name || 'upload.bin');
    upstreamForm.append('name', fakeName || '生活照.jpg');
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

    // 不要手动设置 multipart/form-data 的 Content-Type boundary
    const upstreamResp = await fetch(TARGET_URL, {
      method: 'POST',
      headers: upstreamHeaders,
      body: upstreamForm,
      redirect: 'follow',
    });

    const contentType =
      upstreamResp.headers.get('content-type') || 'text/plain; charset=utf-8';
    const bodyText = await upstreamResp.text();

    return new Response(bodyText, {
      status: upstreamResp.status,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-store',
        ...buildCorsHeaders(origin, allowedOrigin),
      },
    });
  } catch (err) {
    return json(
      {
        ok: false,
        error: 'internal_error',
        message: err?.message || String(err),
      },
      500,
      buildCorsHeaders(origin, allowedOrigin)
    );
  }
}