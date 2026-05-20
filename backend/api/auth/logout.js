import { json, withCors } from '../_lib/http.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  return json(res, 200, { ok: true });
});
