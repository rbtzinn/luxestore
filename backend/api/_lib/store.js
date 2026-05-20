import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const localDbPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.data', 'db.json');

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function assertWritableStorage() {
  if (!hasKv() && process.env.VERCEL) {
    throw new Error('Configure KV_REST_API_URL e KV_REST_API_TOKEN na Vercel para persistir usuarios.');
  }
}

async function kvCommand(command) {
  const response = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`KV respondeu com HTTP ${response.status}.`);
  }

  const payload = await response.json();

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
}

async function readLocalDb() {
  try {
    const file = await readFile(localDbPath, 'utf8');
    return JSON.parse(file);
  } catch {
    return {};
  }
}

async function writeLocalDb(db) {
  await mkdir(dirname(localDbPath), { recursive: true });
  await writeFile(localDbPath, JSON.stringify(db, null, 2));
}

export async function getValue(key) {
  assertWritableStorage();

  if (hasKv()) {
    const value = await kvCommand(['GET', key]);
    return value ? JSON.parse(value) : null;
  }

  const db = await readLocalDb();
  return db[key] ?? null;
}

export async function setValue(key, value) {
  assertWritableStorage();

  const serialized = JSON.stringify(value);

  if (hasKv()) {
    await kvCommand(['SET', key, serialized]);
    return;
  }

  const db = await readLocalDb();
  db[key] = value;
  await writeLocalDb(db);
}

export async function setValueIfMissing(key, value) {
  assertWritableStorage();

  const serialized = JSON.stringify(value);

  if (hasKv()) {
    const result = await kvCommand(['SET', key, serialized, 'NX']);
    return result === 'OK';
  }

  const db = await readLocalDb();

  if (Object.prototype.hasOwnProperty.call(db, key)) {
    return false;
  }

  db[key] = value;
  await writeLocalDb(db);
  return true;
}

export async function deleteValue(key) {
  assertWritableStorage();

  if (hasKv()) {
    await kvCommand(['DEL', key]);
    return;
  }

  const db = await readLocalDb();
  delete db[key];
  await writeLocalDb(db);
}
