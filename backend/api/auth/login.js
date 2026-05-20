import { createAccessToken, verifyPassword } from '../_lib/auth.js';
import { json, readJson, withCors } from '../_lib/http.js';
import { findUserByEmail, publicUserResponse } from '../_lib/users.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Metodo nao permitido.' });
  }

  try {
    const { email, password } = await readJson(req);
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return json(res, 401, { error: 'Email ou senha invalidos.' });
    }

    return json(res, 200, {
      accessToken: createAccessToken(user),
      ...publicUserResponse(user),
    });
  } catch (error) {
    return json(res, error.statusCode || 500, { error: error.message || 'Erro ao entrar.' });
  }
});
