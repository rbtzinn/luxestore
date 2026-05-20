import { randomUUID } from 'node:crypto';
import { hashPassword } from './auth.js';
import { deleteValue, getValue, setValue, setValueIfMissing } from './store.js';
import { httpError } from './http.js';

const emailKey = (email) => `email:${email.toLowerCase()}`;
const usernameKey = (username) => `username:${username.toLowerCase()}`;
const userKey = (userId) => `user:${userId}`;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeUsername(username) {
  return String(username || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');
}

function assertValidSignup(payload) {
  const email = normalizeEmail(payload.email);
  const username = normalizeUsername(payload.username);
  const fullName = String(payload.fullName || '').trim();
  const password = String(payload.password || '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw httpError(400, 'Email invalido.');
  }

  if (password.length < 8) {
    throw httpError(400, 'A senha precisa ter pelo menos 8 caracteres.');
  }

  if (username.length < 3) {
    throw httpError(400, 'O usuario precisa ter pelo menos 3 caracteres.');
  }

  if (!fullName) {
    throw httpError(400, 'Informe o nome completo.');
  }

  return { email, username, fullName, password };
}

export async function createUser(payload) {
  const { email, username, fullName, password } = assertValidSignup(payload);
  const userId = randomUUID();

  const reservedEmail = await setValueIfMissing(emailKey(email), userId);

  if (!reservedEmail) {
    throw httpError(409, 'Este email ja esta cadastrado.');
  }

  const reservedUsername = await setValueIfMissing(usernameKey(username), userId);

  if (!reservedUsername) {
    await deleteValue(emailKey(email));
    throw httpError(409, 'Este usuario ja esta cadastrado.');
  }

  const now = new Date().toISOString();
  const user = {
    id: userId,
    email,
    passwordHash: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
    profile: {
      id: userId,
      email,
      username,
      full_name: fullName,
      avatar_url: null,
      phone: null,
      role: email === process.env.ADMIN_EMAIL?.trim().toLowerCase() ? 'admin' : 'customer',
      created_at: now,
      updated_at: now,
    },
  };

  await setValue(userKey(userId), user);
  return user;
}

export async function getUserById(userId) {
  if (!userId) return null;
  return getValue(userKey(userId));
}

export async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const userId = await getValue(emailKey(normalizedEmail));
  return getUserById(userId);
}

export async function updateUserProfile(user, payload) {
  const updates = {};

  if (payload.fullName !== undefined) {
    const fullName = String(payload.fullName || '').trim();

    if (!fullName) {
      throw httpError(400, 'Informe o nome completo.');
    }

    updates.full_name = fullName;
  }

  if (payload.phone !== undefined) {
    updates.phone = payload.phone ? String(payload.phone).trim() : null;
  }

  if (payload.avatarUrl !== undefined) {
    updates.avatar_url = payload.avatarUrl ? String(payload.avatarUrl).trim() : null;
  }

  if (payload.username !== undefined) {
    const nextUsername = normalizeUsername(payload.username);

    if (nextUsername.length < 3) {
      throw httpError(400, 'O usuario precisa ter pelo menos 3 caracteres.');
    }

    if (nextUsername !== user.profile.username) {
      const reserved = await setValueIfMissing(usernameKey(nextUsername), user.id);

      if (!reserved) {
        throw httpError(409, 'Este usuario ja esta cadastrado.');
      }

      await deleteValue(usernameKey(user.profile.username));
      updates.username = nextUsername;
    }
  }

  const updatedUser = {
    ...user,
    updatedAt: new Date().toISOString(),
    profile: {
      ...user.profile,
      ...updates,
      updated_at: new Date().toISOString(),
    },
  };

  await setValue(userKey(user.id), updatedUser);
  return updatedUser;
}

export function publicUserResponse(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.profile.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    profile: user.profile,
  };
}
