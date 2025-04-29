"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface TaskStatsProps {
  total: number
  completed: number
  highPriority: number
}

export function TaskStats({ total, completed, highPriority }: TaskStatsProps) {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <motion.h3
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={total}
              >
                {total}
              </motion.h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <div className="flex items-baseline gap-2">
                <motion.h3
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={completed}
                >
                  {completed}
                </motion.h3>
                <span className="text-sm text-muted-foreground">/ {total}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={completionPercentage} className="h-2" />
                <span className="text-xs font-medium">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Priority</p>
              <motion.h3
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={highPriority}
              >
                {highPriority}
              </motion.h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
