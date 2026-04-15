import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy-initialize the client so builds don't fail when DATABASE_URL is absent
let _sql: NeonQueryFunction<false, false> | null = null;
function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or your hosting provider's env vars."
    );
  }
  _sql = neon(url);
  return _sql;
}

// A proxy that initializes the drizzle client on first property access
function buildDb() {
  let client: ReturnType<typeof drizzle> | null = null;
  const get = () => {
    if (client) return client;
    client = drizzle(getSql(), { schema });
    return client;
  };
  return new Proxy(
    {},
    {
      get(_, prop: string | symbol) {
        const target = get() as unknown as Record<string | symbol, unknown>;
        return target[prop];
      },
    }
  ) as ReturnType<typeof drizzle<typeof schema>>;
}

export const db = buildDb();
