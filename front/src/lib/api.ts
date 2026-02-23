import axios, { isAxiosError } from 'axios'

const TOKEN_KEY = 'task_manager_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
}

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const apiMessage =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : undefined

    const validationErrors = error.response?.data?.errors as
      | Record<string, string[]>
      | undefined

    if (validationErrors) {
      const firstErrorGroup = Object.values(validationErrors)[0]
      if (Array.isArray(firstErrorGroup) && firstErrorGroup[0]) {
        return firstErrorGroup[0]
      }
    }

    if (apiMessage) {
      return apiMessage
    }

    if (error.response?.status === 401) {
      return 'Session expirée. Merci de vous reconnecter.'
    }
  }

  return 'Une erreur inattendue est survenue.'
}
