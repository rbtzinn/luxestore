import { requireUser } from '../_lib/auth.js';
import { json, withCors } from '../_lib/http.js';
import { publicUserResponse } from '../_lib/users.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  try {
    const user = await requireUser(req);
    return json(res, 200, publicUserResponse(user));
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message || 'Nao autenticado.' });
  }
});
