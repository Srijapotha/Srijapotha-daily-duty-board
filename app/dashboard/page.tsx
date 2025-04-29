import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskDashboard } from "@/components/task-dashboard"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} profile={profile} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <TaskDashboard userId={session.user.id} />
        </main>
      </div>
    </div>
  )
}
