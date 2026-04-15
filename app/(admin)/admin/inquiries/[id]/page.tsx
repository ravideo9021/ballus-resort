import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/schema";
import { PageHeader } from "@/components/admin/page-header";
import { updateInquiryStatus, deleteInquiry } from "../../actions";
import { formatDate } from "@/lib/admin-utils";
import { ArrowLeft } from "lucide-react";

export const metadata = { robots: { index: false, follow: false } };

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return notFound();
  const [inq] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  if (!inq) return notFound();

  return (
    <div className="p-10 max-w-4xl">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1A6B7A] hover:text-[#C9A24B] mb-6"
      >
        <ArrowLeft className="w-3 h-3" /> Back to inquiries
      </Link>

      <PageHeader
        eyebrow={`Inquiry #${inq.id}`}
        title={`${inq.name}`}
        description={`Received ${formatDate(inq.createdAt)} · Status: ${inq.status}`}
      />

      <div className="bg-white border border-[#0B1B22]/10 p-8 space-y-6 mb-6">
        <dl className="grid md:grid-cols-2 gap-6">
          <Field label="Type" value={inq.type} />
          <Field label="Name" value={inq.name} />
          <Field
            label="Email"
            value={
              <a href={`mailto:${inq.email}`} className="text-[#1A6B7A] hover:text-[#C9A24B]">
                {inq.email}
              </a>
            }
          />
          {inq.phone && (
            <Field
              label="Phone"
              value={
                <a href={`tel:${inq.phone}`} className="text-[#1A6B7A] hover:text-[#C9A24B]">
                  {inq.phone}
                </a>
              }
            />
          )}
          {inq.preferredDates && <Field label="Preferred Dates" value={inq.preferredDates} />}
          {inq.guests && <Field label="Guests" value={inq.guests} />}
          {inq.venue && <Field label="Venue / Suite" value={inq.venue} />}
        </dl>
        {inq.message && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#0B1B22]/50 mb-2">
              Message
            </p>
            <p className="text-[#0B1B22] leading-relaxed whitespace-pre-wrap heading-serif italic text-lg">
              {inq.message}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {inq.status !== "handled" && (
          <form
            action={async () => {
              "use server";
              await updateInquiryStatus(inq.id, "handled");
            }}
          >
            <button
              type="submit"
              className="bg-[#1A6B7A] text-white px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#0F3B47] transition-colors"
            >
              Mark Handled
            </button>
          </form>
        )}
        {inq.status !== "new" && (
          <form
            action={async () => {
              "use server";
              await updateInquiryStatus(inq.id, "new");
            }}
          >
            <button
              type="submit"
              className="bg-white border border-[#0B1B22]/15 text-[#0B1B22] px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:border-[#C9A24B] transition-colors"
            >
              Reopen
            </button>
          </form>
        )}
        {inq.status !== "archived" && (
          <form
            action={async () => {
              "use server";
              await updateInquiryStatus(inq.id, "archived");
            }}
          >
            <button
              type="submit"
              className="bg-white border border-[#0B1B22]/15 text-[#0B1B22] px-6 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold hover:border-[#C9A24B] transition-colors"
            >
              Archive
            </button>
          </form>
        )}
        <form
          action={async () => {
            "use server";
            await deleteInquiry(inq.id);
          }}
          className="ml-auto"
        >
          <button
            type="submit"
            className="text-xs uppercase tracking-[0.2em] text-red-600 hover:text-red-700 font-semibold px-3 py-2.5"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.3em] text-[#0B1B22]/50 mb-1">{label}</dt>
      <dd className="text-[#0B1B22]">{value}</dd>
    </div>
  );
}
