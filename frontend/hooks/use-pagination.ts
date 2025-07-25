import { useState, useCallback, useMemo } from 'react'

interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  totalItems: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    }
  }, [currentPage, pageSize, totalItems])

  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(1, Math.min(page, paginationState.totalPages))
      setCurrentPage(clampedPage)
      onPageChange?.(clampedPage)
    },
    [paginationState.totalPages, onPageChange]
  )

  const nextPage = useCallback(() => {
    if (paginationState.hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, paginationState.hasNextPage, goToPage])

  const previousPage = useCallback(() => {
    if (paginationState.hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, paginationState.hasPreviousPage, goToPage])

  const firstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const lastPage = useCallback(() => {
    goToPage(paginationState.totalPages)
  }, [paginationState.totalPages, goToPage])

  const changePageSize = useCallback(
    (newPageSize: number) => {
      const newTotalPages = Math.ceil(totalItems / newPageSize)
      const newCurrentPage = Math.min(currentPage, newTotalPages)
      
      setPageSize(newPageSize)
      setCurrentPage(newCurrentPage)
      
      onPageSizeChange?.(newPageSize)
      onPageChange?.(newCurrentPage)
    },
    [currentPage, totalItems, onPageChange, onPageSizeChange]
  )

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  // Generate page numbers for pagination UI
  const getPageNumbers = useCallback(
    (maxVisible = 5): number[] => {
      const { totalPages } = paginationState
      
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      const half = Math.floor(maxVisible / 2)
      let start = Math.max(1, currentPage - half)
      let end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    },
    [paginationState, currentPage]
  )

  // Get items for current page from an array
  const getPageItems = useCallback(
    <T>(items: T[]): T[] => {
      const { startIndex, endIndex } = paginationState
      return items.slice(startIndex, endIndex + 1)
    },
    [paginationState]
  )

  return {
    ...paginationState,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    reset,
    getPageNumbers,
    getPageItems,
  }
}

// Hook for infinite scroll pagination
export function useInfinitePagination<T>({
  fetchMore,
  pageSize = 20,
  initialData = [],
}: {
  fetchMore: (page: number, pageSize: number) => Promise<T[]>
  pageSize?: number
  initialData?: T[]
}) {
  const [data, setData] = useState<T[]>(initialData)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const newItems = await fetchMore(currentPage, pageSize)
      
      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setData(prev => [...prev, ...newItems])
        setCurrentPage(prev => prev + 1)
        
        if (newItems.length < pageSize) {
          setHasMore(false)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load more items')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, isLoading, hasMore, fetchMore])

  const reset = useCallback(() => {
    setData(initialData)
    setCurrentPage(1)
    setHasMore(true)
    setError(null)
    setIsLoading(false)
  }, [initialData])

  const refresh = useCallback(async () => {
    setData([])
    setCurrentPage(1)
    setHasMore(true)
    setError(null)
    
    await loadMore()
  }, [loadMore])

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
    refresh,
  }
}

// Hook for cursor-based pagination
export function useCursorPagination<T, C = string>({
  fetchPage,
  pageSize = 20,
  initialData = [],
}: {
  fetchPage: (cursor: C | null, pageSize: number) => Promise<{
    items: T[]
    nextCursor: C | null
    hasMore: boolean
  }>
  pageSize?: number
  initialData?: T[]
}) {
  const [data, setData] = useState<T[]>(initialData)
  const [nextCursor, setNextCursor] = useState<C | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchPage(nextCursor, pageSize)
      
      setData(prev => [...prev, ...result.items])
      setNextCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load more items')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [nextCursor, pageSize, isLoading, hasMore, fetchPage])

  const reset = useCallback(() => {
    setData(initialData)
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    setIsLoading(false)
  }, [initialData])

  const refresh = useCallback(async () => {
    setData([])
    setNextCursor(null)
    setHasMore(true)
    setError(null)
    
    await loadMore()
  }, [loadMore])

  return {
    data,
    isLoading,
    hasMore,
    error,
    nextCursor,
    loadMore,
    reset,
    refresh,
  }
}
