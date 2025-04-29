"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/types/task"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, subDays } from "date-fns"

interface TaskAnalyticsProps {
  totalTasks: number
  completedTasks: number
  highPriorityTasks: number
  tasks: Task[]
}

export function TaskAnalytics({ totalTasks, completedTasks, highPriorityTasks, tasks }: TaskAnalyticsProps) {
  // Prepare data for pie chart
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#22c55e" },
    { name: "Incomplete", value: totalTasks - completedTasks, color: "#f97316" },
  ]

  const priorityData = [
    { name: "High", value: highPriorityTasks, color: "#ef4444" },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
      color: "#f59e0b",
    },
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
      color: "#22c55e",
    },
  ]

  // Prepare data for bar chart (tasks created in the last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    const formattedDate = format(date, "yyyy-MM-dd")
    const tasksForDay = tasks.filter((task) => format(new Date(task.created_at), "yyyy-MM-dd") === formattedDate)

    return {
      date: format(date, "EEE"),
      total: tasksForDay.length,
      completed: tasksForDay.filter((task) => task.status === "complete").length,
    }
  }).reverse()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Overview of completed vs. incomplete tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Task Priority</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Task Activity</CardTitle>
            <CardDescription>Tasks created and completed in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Tasks" fill="#6366f1" />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
