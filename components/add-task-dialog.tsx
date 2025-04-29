"use client"

import type React from "react"

import { useState } from "react"
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

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Omit<Task, "id" | "user_id" | "created_at">) => Promise<void>
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onAddTask({
        title,
        description,
        priority,
        status: "incomplete",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
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
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task to keep track of your work.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                disabled={isSubmitting}
                className="transition-all"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                disabled={isSubmitting}
                className="min-h-[100px] transition-all"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
