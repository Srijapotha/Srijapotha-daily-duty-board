"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart2, CheckSquare, Home, PlusCircle, Settings, User } from "lucide-react"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { useState } from "react"
import { useTasks } from "@/hooks/use-tasks"
import { useAuth } from "@/components/auth-provider"

interface DashboardSidebarProps {
  closeSidebar?: () => void
}

export function DashboardSidebar({ closeSidebar }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { user } = useAuth()
  const { addTask } = useTasks(user?.id || "")

  const handleAddTask = async (task: any) => {
    await addTask(task)
    setIsAddDialogOpen(false)
    if (closeSidebar) {
      closeSidebar()
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      <div className="flex h-full flex-col border-r bg-background">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span>Navigation</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <AddTaskDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddTask={handleAddTask} />
    </>
  )
}
