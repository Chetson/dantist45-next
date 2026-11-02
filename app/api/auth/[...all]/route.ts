import { getAuth } from "@/lib/auth";

// Эндпоинты Better Auth: /api/auth/sign-in/email, /api/auth/sign-out и др.
export function GET(request: Request) {
  return getAuth().handler(request);
}

export function POST(request: Request) {
  return getAuth().handler(request);
}
