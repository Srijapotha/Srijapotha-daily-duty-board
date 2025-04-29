"use client"

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import type { Task } from "@/types/task"
import { useToast } from "@/components/ui/use-toast"

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error fetching tasks",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, userId, toast])

  // Set up initial fetch and real-time subscription
  useEffect(() => {
    if (!userId) return

    fetchTasks()

    // Set up real-time subscription
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTasks()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, fetchTasks])

  // Add task
  const addTask = async (task: Omit<Task, "id" | "user_id" | "created_at">) => {
    try {
      const { error } = await supabase.from("tasks").insert([
        {
          ...task,
          user_id: userId,
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error adding task",
        description: "Please try again later",
        variant: "destructive",
      })
      throw error
    }
  }

  // Update task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id).eq("user_id", userId)

      if (error) {
        throw error
      }

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error updating task",
        description: "Please try again later",
        variant: "destructive",
      })
      throw error
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", userId)

      if (error) {
        throw error
      }

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error deleting task",
        description: "Please try again later",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
  }
}
