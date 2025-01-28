import { AdminNav } from "@/components/admin/admin-nav";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { Motion } from "@/components/ui/motion";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Verify admin role
  const { data: user } = await supabase
    .from("User")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <AdminNav />
        <Motion
          className="transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            paddingLeft: "var(--sidebar-width, 240px)",
          }}
        >
          <main className="container min-h-screen py-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </Motion>
      </div>
    </SidebarProvider>
  );
}
