import { requireUser } from './_lib/auth.js';
import { json, readJson, withCors } from './_lib/http.js';
import { publicUserResponse, updateUserProfile } from './_lib/users.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'GET') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  try {
    const user = await requireUser(req);

    if (req.method === 'GET') {
      return json(res, 200, publicUserResponse(user));
    }

    const body = await readJson(req);
    const updatedUser = await updateUserProfile(user, body);
    return json(res, 200, publicUserResponse(updatedUser));
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message || 'Erro ao atualizar perfil.' });
  }
});
