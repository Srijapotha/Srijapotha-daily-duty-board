import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const supabase = createServerClient()

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get tasks for the authenticated user
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ tasks: data })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create the task
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: body.title,
          description: body.description || null,
          status: body.status || "incomplete",
          priority: body.priority || "medium",
          user_id: session.user.id,
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ task: data[0] })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
