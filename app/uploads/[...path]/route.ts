import { readFile } from "node:fs/promises";
import path from "node:path";
import { resolveUpload, UPLOAD_TYPES } from "@/lib/uploads";

// Раздача файлов из UPLOAD_DIR. Имена — случайные UUID, файл по имени не
// меняется, поэтому кэшируется навсегда.
export async function GET(_: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: segments } = await ctx.params;
  const file = resolveUpload(segments.join("/"));
  const ext = file && (path.extname(file).slice(1) as keyof typeof UPLOAD_TYPES);
  if (!file || !ext || !(ext in UPLOAD_TYPES)) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        "Content-Type": UPLOAD_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
