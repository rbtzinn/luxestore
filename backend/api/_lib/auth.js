import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { httpError } from './http.js';
import { getUserById } from './users.js';

const scrypt = promisify(scryptCallback);
const tokenTtlSeconds = 60 * 60 * 24 * 7;

function secret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    throw httpError(500, 'Configure JWT_SECRET com pelo menos 32 caracteres.');
  }

  return jwtSecret;
}

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(unsignedToken) {
  return createHmac('sha256', secret()).update(unsignedToken).digest('base64url');
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash?.startsWith('scrypt:')) {
    return false;
  }

  const [, salt, hash] = storedHash.split(':');
  const expectedHash = Buffer.from(hash, 'hex');
  const actualHash = await scrypt(password, salt, 64);

  return expectedHash.length === actualHash.length && timingSafeEqual(expectedHash, actualHash);
}

export function createAccessToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.profile.role,
    iat: now,
    exp: now + tokenTtlSeconds,
  };
  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  return `${unsignedToken}.${signToken(unsignedToken)}`;
}

export function verifyAccessToken(token) {
  if (!token) {
    throw httpError(401, 'Token ausente.');
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw httpError(401, 'Token invalido.');
  }

  const [header, payload, signature] = parts;
  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = signToken(unsignedToken);

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    throw httpError(401, 'Token invalido.');
  }

  let claims;

  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    throw httpError(401, 'Token invalido.');
  }

  if (!claims.exp || claims.exp < Math.floor(Date.now() / 1000)) {
    throw httpError(401, 'Token expirado.');
  }

  return claims;
}

export async function requireUser(req) {
  const authorization = req.headers.authorization || '';
  const [, token] = authorization.match(/^Bearer\s+(.+)$/i) || [];
  const claims = verifyAccessToken(token);
  const user = await getUserById(claims.sub);

  if (!user) {
    throw httpError(401, 'Usuario nao encontrado.');
  }

  return user;
}
