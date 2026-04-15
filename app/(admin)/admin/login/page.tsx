import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login — Ballu's Resort",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-[#0B1B22] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="heading-display text-[#F5EFE3] text-5xl mb-2">Ballu&apos;s</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
            Admin Panel
          </p>
        </div>
        <div className="bg-[#0F3B47] p-10 border border-white/10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
