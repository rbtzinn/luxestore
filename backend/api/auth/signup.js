import { createUser, publicUserResponse } from '../_lib/users.js';
import { createAccessToken } from '../_lib/auth.js';
import { json, readJson, withCors } from '../_lib/http.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  try {
    const body = await readJson(req);
    const user = await createUser(body);
    const accessToken = createAccessToken(user);

    return json(res, 201, {
      accessToken,
      ...publicUserResponse(user),
    });
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message || 'Erro ao cadastrar.' });
  }
});
