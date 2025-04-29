"use client"

import type { Task } from "@/types/task"
import { TaskCard } from "@/components/task-card"
import { motion } from "framer-motion"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
}

export function TaskList({ tasks, isLoading, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-full mb-4"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center">
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or create a new task.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <TaskCard task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
        </motion.div>
      ))}
    </div>
  )
}
