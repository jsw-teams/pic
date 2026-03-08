function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export default async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return json({ ok: false, message: 'Method Not Allowed' }, 405);
  }

  const turnstileSiteKey = String(env.TURNSTILE_SITE_KEY || '').trim();
  if (!turnstileSiteKey) {
    return json({ ok: false, message: 'TURNSTILE_SITE_KEY 未配置' }, 500);
  }

  return json({
    ok: true,
    turnstileSiteKey,
    maxUploadBytes: 5.5 * 1024 * 1024,
  });
}