import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { newsletterSignups } from "@/lib/schema";
import { toCsv } from "@/lib/admin-utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db
    .select()
    .from(newsletterSignups)
    .orderBy(desc(newsletterSignups.createdAt));
  const csv = toCsv(
    rows.map((r) => ({
      email: r.email,
      subscribed: r.createdAt?.toISOString() ?? "",
    })),
    ["email", "subscribed"]
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ballus-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
