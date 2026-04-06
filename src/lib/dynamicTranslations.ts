import type { Banner, Category, Product, Review } from '@/types';
import { normalizeLanguage, type AppLanguage } from '@/lib/locale';

const CACHE_PREFIX = 'luxe_dynamic_translation_v1';
const SPLITTER = '\n[[[LUXE_SPLIT]]]\n';
const memoryCache = new Map<string, string>();

function getCacheKey(language: AppLanguage, text: string) {
  return `${CACHE_PREFIX}:${language}:${text}`;
}

function readCached(language: AppLanguage, text: string) {
  const key = getCacheKey(language, text);
  if (memoryCache.has(key)) return memoryCache.get(key)!;

  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      memoryCache.set(key, cached);
      return cached;
    }
  } catch {
    // ignore storage issues
  }

  return null;
}

function writeCached(language: AppLanguage, text: string, translated: string) {
  const key = getCacheKey(language, text);
  memoryCache.set(key, translated);

  try {
    localStorage.setItem(key, translated);
  } catch {
    // ignore storage issues
  }
}

function chunkTexts(texts: string[], limit = 16, charLimit = 3000) {
  const chunks: string[][] = [];
  let current: string[] = [];
  let currentChars = 0;

  for (const text of texts) {
    const nextChars = currentChars + text.length;
    if (current.length >= limit || nextChars >= charLimit) {
      if (current.length) chunks.push(current);
      current = [text];
      currentChars = text.length;
    } else {
      current.push(text);
      currentChars = nextChars;
    }
  }

  if (current.length) chunks.push(current);
  return chunks;
}

async function translateChunk(texts: string[], target: AppLanguage) {
  if (!texts.length || target === 'en') return texts;

  const joined = texts.join(SPLITTER);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', 'pt');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', joined);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Falha ao traduzir conteúdo dinâmico.');

  const payload = (await response.json()) as unknown;
  const translated = Array.isArray(payload) && Array.isArray(payload[0])
    ? payload[0].map((part: unknown) => Array.isArray(part) ? String(part[0] ?? '') : '').join('')
    : joined;

  const pieces = translated.split(SPLITTER);
  return pieces.length === texts.length ? pieces : texts;
}

export async function translateTexts(texts: string[], language?: string) {
  const target = normalizeLanguage(language);
  if (target === 'en') return texts;

  const normalizedTexts = texts.map((item) => item?.trim() ?? '');
  const uniqueTexts = Array.from(new Set(normalizedTexts.filter(Boolean)));
  const translatedMap = new Map<string, string>();
  const missing: string[] = [];

  for (const text of uniqueTexts) {
    const cached = readCached(target, text);
    if (cached) translatedMap.set(text, cached);
    else missing.push(text);
  }

  for (const chunk of chunkTexts(missing)) {
    try {
      const translatedChunk = await translateChunk(chunk, target);
      chunk.forEach((original, index) => {
        const translated = translatedChunk[index] || original;
        translatedMap.set(original, translated);
        writeCached(target, original, translated);
      });
    } catch {
      chunk.forEach((original) => translatedMap.set(original, original));
    }
  }

  return normalizedTexts.map((text) => translatedMap.get(text) || text);
}

export async function localizeCategories(categories: Category[], language?: string) {
  const target = normalizeLanguage(language);
  if (target === 'en') return categories;

  const [names, descriptions] = await Promise.all([
    translateTexts(categories.map((item) => item.name), target),
    translateTexts(categories.map((item) => item.description), target),
  ]);

  return categories.map((item, index) => ({
    ...item,
    name: names[index] || item.name,
    description: descriptions[index] || item.description,
  }));
}

export async function localizeProducts(products: Product[], language?: string) {
  const target = normalizeLanguage(language);
  if (target === 'en') return products;

  const [titles, descriptions] = await Promise.all([
    translateTexts(products.map((item) => item.title), target),
    translateTexts(products.map((item) => item.description), target),
  ]);

  return products.map((item, index) => ({
    ...item,
    title: titles[index] || item.title,
    description: descriptions[index] || item.description,
    images: item.images.map((image) => ({
      ...image,
      alt: titles[index] || image.alt,
    })),
    category: item.category,
  }));
}

export async function localizeReviews(reviews: Review[], language?: string) {
  const target = normalizeLanguage(language);
  if (target === 'en') return reviews;

  const [titles, comments] = await Promise.all([
    translateTexts(reviews.map((item) => item.title), target),
    translateTexts(reviews.map((item) => item.comment), target),
  ]);

  return reviews.map((item, index) => ({
    ...item,
    title: titles[index] || item.title,
    comment: comments[index] || item.comment,
  }));
}

export async function localizeBanners(banners: Banner[], language?: string) {
  const target = normalizeLanguage(language);
  if (target === 'en') return banners;

  const [titles, subtitles] = await Promise.all([
    translateTexts(banners.map((item) => item.title), target),
    translateTexts(banners.map((item) => item.subtitle), target),
  ]);

  return banners.map((item, index) => ({
    ...item,
    title: titles[index] || item.title,
    subtitle: subtitles[index] || item.subtitle,
  }));
}
