import { useCallback, useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../lib/api'
import type { Comment, CommentPayload } from '../types'

export function useComments(taskId: number | null) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchComments = useCallback(async () => {
        if (!taskId) {
            setComments([])
            return
        }

        setIsFetching(true)
        try {
            const response = await api.get<{ data: Comment[] }>(`/tasks/${taskId}/comments`)
            setComments(response.data.data)
        } catch (error) {
            console.error(getApiErrorMessage(error))
        } finally {
            setIsFetching(false)
        }
    }, [taskId])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const addComment = async (payload: CommentPayload) => {
        if (!taskId) return

        setIsSaving(true)
        try {
            const response = await api.post<{ data: Comment }>(`/tasks/${taskId}/comments`, payload)
            // Optimistic update or just refetch
            setComments((prev) => [response.data.data, ...prev])
        } catch (error) {
            throw new Error(getApiErrorMessage(error))
        } finally {
            setIsSaving(false)
        }
    }

    const deleteComment = async (commentId: number) => {
        if (!taskId) return

        setDeletingId(commentId)
        try {
            await api.delete(`/tasks/${taskId}/comments/${commentId}`)
            setComments((prev) => prev.filter((c) => c.id !== commentId))
        } catch (error) {
            throw new Error(getApiErrorMessage(error))
        } finally {
            setDeletingId(null)
        }
    }

    return {
        comments,
        isFetching,
        isSaving,
        deletingId,
        addComment,
        deleteComment,
        refreshComments: fetchComments,
    }
}
