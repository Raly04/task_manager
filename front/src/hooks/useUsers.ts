import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

export function useUsers(isEnabled: boolean) {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        if (!isEnabled) return

        setIsLoading(true)
        try {
            const response = await api.get<{ data: User[] }>('/users')
            setUsers(response.data.data)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setIsLoading(false)
        }
    }, [isEnabled])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return { users, isLoading, fetchUsers }
}
