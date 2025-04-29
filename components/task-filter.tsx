"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFilterProps {
  value: "all" | "active" | "completed"
  onChange: (value: "all" | "active" | "completed") => void
}

export function TaskFilter({ value, onChange }: TaskFilterProps) {
  return (
    <Select value={value} onValueChange={(value) => onChange(value as "all" | "active" | "completed")}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Filter tasks" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tasks</SelectItem>
        <SelectItem value="active">Active Tasks</SelectItem>
        <SelectItem value="completed">Completed Tasks</SelectItem>
      </SelectContent>
    </Select>
  )
}
