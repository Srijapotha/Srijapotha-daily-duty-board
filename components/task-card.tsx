"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Edit, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(task.id, {
        status: task.status === "complete" ? "incomplete" : "complete",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const priorityColor = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={task.status === "complete"}
                onCheckedChange={handleStatusChange}
                className="mt-1"
                disabled={isUpdating}
              />
              <CardTitle className={task.status === "complete" ? "line-through text-muted-foreground" : ""}>
                {task.title}
              </CardTitle>
            </div>
            <Badge className={priorityColor[task.priority as keyof typeof priorityColor]}>{task.priority}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${task.status === "complete" ? "line-through text-muted-foreground" : ""}`}>
            {task.description || "No description provided"}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)} disabled={isUpdating}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" disabled={isDeleting || isUpdating}>
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateTask={(updates) => {
          onUpdate(task.id, updates)
          setIsEditDialogOpen(false)
        }}
      />
    </>
  )
}
