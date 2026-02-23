import { useCallback, useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'
import type { PaginationMeta, Task, TaskFilters, TaskPayload } from '../types'

interface LaravelTaskResponse {
  data: Task[]
  meta: PaginationMeta
}

const INITIAL_META: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
}

interface UseTasksOptions {
  filters: TaskFilters
  page: number
  isEnabled: boolean
}

export function useTasks({ filters, page, isEnabled }: UseTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(INITIAL_META)
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!isEnabled) {
      setTasks([])
      setMeta(INITIAL_META)
      return
    }

    setIsFetching(true)
    try {
      const params = {
        page,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        assigned_to: filters.assigned_to || undefined,
        search: filters.search.trim() || undefined,
      }

      const response = await api.get<LaravelTaskResponse>('/tasks', { params })
      setTasks(response.data.data)
      setMeta(response.data.meta)
      setFetchError(null)
    } catch (error) {
      const message = getApiErrorMessage(error)
      setFetchError(message)
      throw new Error(message)
    } finally {
      setIsFetching(false)
    }
  }, [filters.assigned_to, filters.priority, filters.search, filters.status, isEnabled, page])

  useEffect(() => {
    fetchTasks().catch(() => {
      // Error state is already stored in fetchError.
    })
  }, [fetchTasks])

  const createTask = useCallback(async (payload: TaskPayload) => {
    setIsSaving(true)
    try {
      await api.post('/tasks', payload)
      await fetchTasks()
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }, [fetchTasks])

  const updateTask = useCallback(async (taskId: number, payload: TaskPayload) => {
    setIsSaving(true)
    try {
      await api.put(`/tasks/${taskId}`, payload)
      await fetchTasks()
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }, [fetchTasks])

  const deleteTask = useCallback(async (taskId: number) => {
    setDeletingTaskId(taskId)
    try {
      await api.delete(`/tasks/${taskId}`)
      await fetchTasks()
    } catch (error) {
      throw new Error(getApiErrorMessage(error))
    } finally {
      setDeletingTaskId(null)
    }
  }, [fetchTasks])

  return {
    tasks,
    meta,
    isFetching,
    fetchError,
    isSaving,
    deletingTaskId,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
