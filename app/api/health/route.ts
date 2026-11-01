import { connection } from "next/server";
import { getDb } from "@/lib/db";

// Проверка живости для Docker healthcheck и мониторинга: приложение + БД.
export async function GET() {
  await connection();
  try {
    await getDb().$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "error", db: "unavailable" }, { status: 503 });
  }
}
