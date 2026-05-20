import { json, withCors } from './_lib/http.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  return json(res, 200, {
    ok: true,
    service: 'luxestore-backend',
    storage: process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN ? 'kv' : 'local-dev',
  });
});
