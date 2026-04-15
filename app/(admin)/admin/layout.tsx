import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Toaster } from "sonner";
import { LogOut, ExternalLink } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Login page is a route inside this group but has its own layout conditional
  // We rely on middleware for protection; this is an extra guard
  // If not authenticated and not on /admin/login, redirect handled by middleware

  return (
    <div className="min-h-screen bg-[#F5EFE3] text-[#0B1B22]">
      <Toaster position="top-right" richColors />
      {session ? (
        <div className="flex min-h-screen">
          <aside className="w-64 bg-[#0B1B22] text-[#F5EFE3] flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-white/10">
              <Link href="/admin/dashboard" className="block">
                <p className="heading-serif text-2xl text-[#F5EFE3]">
                  Ballu&apos;s
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B] mt-1">
                  Admin
                </p>
              </Link>
            </div>
            <AdminNav />
            <div className="mt-auto p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F5EFE3]/70 hover:text-[#C9A24B] px-3 py-2"
              >
                <ExternalLink className="w-3 h-3" /> View Site
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F5EFE3]/70 hover:text-[#C9A24B] px-3 py-2"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              </form>
            </div>
          </aside>
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
}
