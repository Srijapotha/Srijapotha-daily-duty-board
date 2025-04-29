"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/types/task"
import { Loader2 } from "lucide-react"

interface EditTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (updates: Partial<Task>) => Promise<void>
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdateTask }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority as "low" | "medium" | "high")
  const [status, setStatus] = useState<"complete" | "incomplete">(task.status as "complete" | "incomplete")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when task changes
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || "")
    setPriority(task.priority as "low" | "medium" | "high")
    setStatus(task.status as "complete" | "incomplete")
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onUpdateTask({
        title,
        description,
        priority,
        status,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as "complete" | "incomplete")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
