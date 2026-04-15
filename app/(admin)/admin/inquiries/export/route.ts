import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/schema";
import { toCsv } from "@/lib/admin-utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  const csv = toCsv(
    rows.map((r) => ({
      id: r.id,
      received: r.createdAt?.toISOString() ?? "",
      status: r.status,
      type: r.type,
      name: r.name,
      email: r.email,
      phone: r.phone ?? "",
      preferredDates: r.preferredDates ?? "",
      guests: r.guests ?? "",
      venue: r.venue ?? "",
      message: r.message ?? "",
    })),
    [
      "id",
      "received",
      "status",
      "type",
      "name",
      "email",
      "phone",
      "preferredDates",
      "guests",
      "venue",
      "message",
    ]
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ballus-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
