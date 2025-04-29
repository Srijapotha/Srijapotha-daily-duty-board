"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { TaskFilter } from "@/components/task-filter"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/types/task"
import { Input } from "@/components/ui/input"
import { TaskStats } from "@/components/task-stats"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface TaskDashboardProps {
  userId: string
}

export function TaskDashboard({ userId }: TaskDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest")

  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks(userId)

  // Apply filters and search
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (filter !== "all") {
      if (filter === "active" && task.status !== "incomplete") return false
      if (filter === "completed" && task.status !== "complete") return false
    }

    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query) || false
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      )
    }
    return 0
  })

  const handleAddTask = async (task: Omit<Task, "id" | "user_id" | "created_at">) => {
    await addTask(task)
    setIsAddDialogOpen(false)
  }

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "complete").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Dashboard</h1>
            <p className="text-muted-foreground">Manage your tasks and stay organized</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <TaskStats total={totalTasks} completed={completedTasks} highPriority={highPriorityTasks} />
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <TaskFilter value={filter} onChange={setFilter} />

            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${priorityFilter}-${sortBy}-${searchQuery}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <TaskList tasks={sortedTasks} isLoading={isLoading} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        </motion.div>
      </AnimatePresence>

      <AddTaskDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddTask={handleAddTask} />
    </div>
  )
}
