import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TaskAnalytics } from "@/components/task-analytics"

export default async function AnalyticsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get task statistics
  const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", session.user.id)

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((task) => task.status === "complete").length || 0
  const highPriorityTasks = tasks?.filter((task) => task.priority === "high").length || 0

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} profile={profile} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 text-3xl font-bold">Task Analytics</h1>
            <TaskAnalytics
              totalTasks={totalTasks}
              completedTasks={completedTasks}
              highPriorityTasks={highPriorityTasks}
              tasks={tasks || []}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
