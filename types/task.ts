export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  created_at: string
  user_id: string
}
