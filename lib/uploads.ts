import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Файлы, загруженные через админку. Лежат в UPLOAD_DIR (в Docker — том
// uploads-data), отдаются маршрутом app/uploads/[...path]/route.ts.
// В БД хранится публичный путь: /uploads/staff/<uuid>.jpg

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const UPLOAD_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export function uploadRoot() {
  // turbopackIgnore: каталог задаётся при запуске, трассировать его при сборке не нужно.
  return path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "uploads");
}

/** Тип изображения по сигнатуре файла, а не по имени или заявленному MIME. */
function detectImage(bytes: Uint8Array): keyof typeof UPLOAD_TYPES | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}

export type SavedImage = { ok: true; url: string } | { ok: false; error: string };

/** Сохраняет изображение в каталог folder; ошибка — текстом для формы. */
export async function saveImage(file: File, folder: string): Promise<SavedImage> {
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Файл больше 5 МБ" };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = detectImage(bytes);
  if (!ext) return { ok: false, error: "Нужен файл JPEG, PNG или WebP" };

  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(uploadRoot(), folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return { ok: true, url: `/uploads/${folder}/${name}` };
}

/** Удаляет ранее загруженный файл; пути вне /uploads/ (из seed) не трогает. */
export async function removeUpload(url: string | null | undefined) {
  const file = url && resolveUpload(url.replace(/^\/uploads\//, ""));
  if (!file || !url.startsWith("/uploads/")) return;
  await unlink(file).catch(() => {});
}

/** Абсолютный путь файла внутри UPLOAD_DIR или null, если путь выходит за его пределы. */
export function resolveUpload(relative: string) {
  const root = uploadRoot();
  const file = path.resolve(root, relative);
  return file.startsWith(root + path.sep) ? file : null;
}
