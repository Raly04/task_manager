export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface User {
  id: number
  name: string
  email: string
  role?: 'admin' | 'user'
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_by: User | null
  assigned_to: User | null
  comments_count: number
  created_at: string
}

export interface TaskFilters {
  status: '' | TaskStatus
  priority: '' | TaskPriority
  assigned_to: '' | number
  search: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface TaskPayload {
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date?: string | null
  assigned_to?: number | null
}

export interface AuthPayload {
  email: string
  password: string
}

export interface RegisterPayload extends AuthPayload {
  name: string
  password_confirmation: string
}
export interface Comment {
  id: number
  body: string
  user: User | null
  created_at: string
}

export interface CommentPayload {
  body: string
}
