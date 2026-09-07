import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

import { getAuth } from "@/lib/auth";

// toNextJsHandler needs an auth instance, which must not be constructed at
// module scope (build must not require DATABASE_URL). Build the handlers once,
// lazily, on first request.
let handlers: ReturnType<typeof toNextJsHandler> | null = null;

function getHandlers() {
  if (!handlers) {
    handlers = toNextJsHandler(getAuth());
  }
  return handlers;
}

export async function GET(request: NextRequest) {
  return getHandlers().GET(request);
}

export async function POST(request: NextRequest) {
  return getHandlers().POST(request);
}
