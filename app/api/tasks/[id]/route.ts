import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the task
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ task: data })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Update the task
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
      })
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select()

    if (error) {
      throw error
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: data[0] })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Delete the task
    const { error } = await supabase.from("tasks").delete().eq("id", params.id).eq("user_id", session.user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
