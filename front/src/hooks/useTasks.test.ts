import { renderHook, waitFor } from '@testing-library/react'
import { useTasks } from './useTasks'
import { api } from '../lib/api'
import { echo } from '../lib/echo'
import type { TaskFilters } from '../types'

// Mock the API
jest.mock('../lib/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
    getApiErrorMessage: jest.fn((error) => error.message || 'Error'),
}))

// Mock Echo
jest.mock('../lib/echo', () => {
    const mockChannel = {
        listen: jest.fn().mockReturnThis(),
        stopListening: jest.fn().mockReturnThis(),
    }
    return {
        echo: {
            channel: jest.fn().mockReturnValue(mockChannel),
        },
    }
})

describe('useTasks hook (realtime)', () => {
    const mockFilters: TaskFilters = {
        status: '',
        priority: '',
        assigned_to: '',
        search: ''
    }
    const mockTasks = [
        { id: 1, title: 'Task 1' }
    ]
    const mockMeta = { current_page: 1, last_page: 1, per_page: 10, total: 1 }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (api.get as jest.Mock).mockResolvedValue({
                data: { data: mockTasks, meta: mockMeta }
            })
    })

    it('fetches tasks on mount', async () => {
        const { result } = renderHook(() => useTasks({ filters: mockFilters, page: 1, isEnabled: true }))

        await waitFor(() => {
            expect(result.current.tasks).toHaveLength(1)
        })
        expect(api.get).toHaveBeenCalledWith('/tasks', expect.any(Object))
    })

    it('listens for realtime events', async () => {
        renderHook(() => useTasks({ filters: mockFilters, page: 1, isEnabled: true }))

        const mockChannel = echo.channel('tasks')
        expect(mockChannel.listen).toHaveBeenCalledWith('.task.created', expect.any(Function))
        expect(mockChannel.listen).toHaveBeenCalledWith('.task.updated', expect.any(Function))
        expect(mockChannel.listen).toHaveBeenCalledWith('.task.deleted', expect.any(Function))
    })

    it('stops listening on unmount', () => {
        const { unmount } = renderHook(() => useTasks({ filters: mockFilters, page: 1, isEnabled: true }))

        unmount()

        const mockChannel = echo.channel('tasks')
        expect(mockChannel.stopListening).toHaveBeenCalledWith('.task.created')
        expect(mockChannel.stopListening).toHaveBeenCalledWith('.task.updated')
        expect(mockChannel.stopListening).toHaveBeenCalledWith('.task.deleted')
    })
})
