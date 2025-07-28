import * as React from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Sort indicator component
const SortIndicator = ({ direction }: { direction: SortDirection }) => {
  if (direction === 'asc') return <ChevronUp className="ml-1 h-4 w-4" />;
  if (direction === 'desc') return <ChevronDown className="ml-1 h-4 w-4" />;
  return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50 group-hover:opacity-100" />;
};

// Pagination button component
const PaginationButton = ({
  onClick,
  disabled,
  children,
  className = "",
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={cn("h-8 w-8 p-0", className)}
  >
    {children}
  </Button>
);

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnDef<TData> {
  key: string
  header: string | ((props: { column: Column<TData> }) => React.ReactNode)
  cell: (row: TData) => React.ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
  sortable?: boolean
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
}

export interface Column<TData> {
  id: string
  header: string | ((props: { column: Column<TData> }) => React.ReactNode)
  getCellValue: (row: TData) => any
  isSortable: boolean
  isSorted: SortDirection
  toggleSorting: () => void
  getSize: () => number | string | undefined
  getMinSize: () => number | string | undefined
  getMaxSize: () => number | string | undefined
}

export interface SortingState {
  id: string
  desc: boolean
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  emptyMessage?: React.ReactNode
  className?: string
  headerClassName?: string
  rowClassName?: string | ((row: TData, index: number) => string)
  cellClassName?: string
  loading?: boolean
  loadingText?: string
  onRowClick?: (row: TData, e: React.MouseEvent) => void
  sortable?: boolean
  defaultSorting?: SortingState[]
  onSortingChange?: (sorting: SortingState[]) => void
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageCount?: number
  pageIndex?: number
  manualPagination?: boolean
  showPagination?: boolean
  showPageSizeOptions?: boolean
  showPageCount?: boolean
  showRowCount?: boolean
  rowCount?: number
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  noDataMessage?: React.ReactNode
  loadingComponent?: React.ReactNode
  footerComponent?: React.ReactNode
  headerComponent?: React.ReactNode
  enableRowSelection?: boolean
  selectedRows?: TData[]
  onRowSelectionChange?: (selectedRows: TData[]) => void
  getRowId?: (row: TData) => string | number
}

export function DataTable<TData = any>({
  columns: columnsProp,
  data = [],
  emptyMessage = "No data available",
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  loading = false,
  loadingText = "Loading...",
  onRowClick,
  sortable = true,
  defaultSorting = [],
  onSortingChange,
  pagination: enablePagination = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  pageCount: controlledPageCount,
  pageIndex: controlledPageIndex = 0,
  manualPagination = false,
  showPagination = true,
  showPageSizeOptions = true,
  showPageCount = true,
  showRowCount = true,
  rowCount: controlledRowCount,
  striped = true,
  hoverable = true,
  compact = false,
  noDataMessage,
  loadingComponent,
  footerComponent,
  headerComponent,
  enableRowSelection = false,
  selectedRows: controlledSelectedRows = [],
  onRowSelectionChange,
  getRowId = (row: any) => row.id ?? Math.random().toString(36).substring(2, 9),
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState[]>(defaultSorting)
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [selectedRows, setSelectedRows] = React.useState<TData[]>(controlledSelectedRows)
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  const isControlled = React.useRef(controlledPageIndex !== undefined || controlledPageCount !== undefined)
  const rowCount = React.useMemo(
    () => (isControlled.current ? controlledRowCount ?? data.length : data.length),
    [controlledRowCount, data.length, isControlled]
  )

  // Update internal state when controlled props change
  React.useEffect(() => {
    if (isControlled.current) {
      setPageIndex(controlledPageIndex ?? 0)
    }
  }, [controlledPageIndex])

  // Sync selected rows with parent
  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(selectedRows)
    }
  }, [selectedRows, onRowSelectionChange])

  // Create columns with sorting
  const columns = React.useMemo(() => {
    return columnsProp.map((col) => ({
      ...col,
      id: col.key,
      isSortable: sortable && col.sortable !== false,
      isSorted: (() => {
        const sort = sorting.find((s) => s.id === col.key);
        if (!sort) return null;
        return sort.desc ? 'desc' : 'asc';
      })() as SortDirection,
      toggleSorting: () => {
        const newSorting = [...sorting];
        const existingSort = newSorting.findIndex((s) => s.id === col.key);
        
        if (existingSort >= 0) {
          if (newSorting[existingSort].desc) {
            newSorting.splice(existingSort, 1);
          } else {
            newSorting[existingSort] = { ...newSorting[existingSort], desc: true };
          }
        } else {
          newSorting.push({ id: col.key, desc: false });
        }
        
        setSorting(newSorting);
        onSortingChange?.(newSorting);
      },
      getCellValue: (row: TData) => {
        try {
          return row[col.key as keyof TData]
        } catch (e) {
          return null
        }
      },
      getSize: () => col.width,
      getMinSize: () => col.minWidth,
      getMaxSize: () => col.maxWidth,
    }))
  }, [columnsProp, sorting, onSortingChange])

  // Process data with sorting and pagination
  const processedData = React.useMemo(() => {
    let result = [...data]

    // Apply sorting
    if (sorting.length > 0) {
      result = [...data].sort((a, b) => {
        for (const sort of sorting) {
          const column = columns.find((col) => col.id === sort.id)
          if (!column) continue

          const aValue = column.getCellValue(a)
          const bValue = column.getCellValue(b)

          if (aValue === bValue) continue
          
          if (aValue == null) return sort.desc ? 1 : -1
          if (bValue == null) return sort.desc ? -1 : 1
          
          if (aValue < bValue) return sort.desc ? 1 : -1
          if (aValue > bValue) return sort.desc ? -1 : 1
        }
        return 0
      })
    }

    // Apply pagination
    if (enablePagination && !manualPagination) {
      const start = pageIndex * pageSize
      result = result.slice(start, start + pageSize)
    }

    return result
  }, [data, sorting, columns, enablePagination, manualPagination, pageIndex, pageSize])

  // Handle page change
  const handlePageChange = (newPageIndex: number) => {
    if (isControlled.current) {
      onPageChange?.(newPageIndex)
    } else {
      setPageIndex(newPageIndex)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    const newPageCount = Math.ceil(rowCount / newPageSize)
    const newPageIndex = Math.min(pageIndex, newPageCount - 1)
    
    setPageSize(newPageSize)
    onPageSizeChange?.(newPageSize)
    
    if (newPageIndex !== pageIndex) {
      handlePageChange(newPageIndex)
    }
  }

  // Toggle row selection
  const toggleRowSelection = (row: TData) => {
    const rowId = getRowId(row)
    setRowSelection(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
    
    setSelectedRows(prev => {
      if (prev.includes(row)) {
        return prev.filter(r => getRowId(r) !== rowId)
      } else {
        return [...prev, row]
      }
    })
  }

  // Toggle select all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === processedData.length) {
      setSelectedRows([])
      setRowSelection({})
    } else {
      const newSelection: Record<string, boolean> = {}
      processedData.forEach(row => {
        newSelection[getRowId(row)] = true
      })
      setSelectedRows([...processedData])
      setRowSelection(newSelection)
    }
  }

  // Calculate pagination values
  const pageCount = React.useMemo(() => {
    return Math.ceil(rowCount / pageSize)
  }, [rowCount, pageSize])

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, rowCount)

  // Render loading state
  if (loading) {
    return loadingComponent || (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{loadingText}</p>
      </div>
    )
  }

  // Render empty state
  if (data.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground">
          {noDataMessage || emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-md border bg-background shadow-sm", className)}>
      {headerComponent && (
        <div className="border-b bg-muted/30 p-4">
          {headerComponent}
        </div>
      )}
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{loadingText}</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b bg-muted/30 transition-colors hover:bg-muted/50">
                {enableRowSelection && (
                  <th className="w-[40px] px-4 py-3 text-left align-middle [&:has([role=checkbox])]:pr-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={Object.keys(rowSelection).length > 0 && Object.keys(rowSelection).length === processedData.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-muted-foreground transition-colors [&:has([role=checkbox])]:pr-0",
                      column.headerClassName,
                      sortable && column.isSortable && "cursor-pointer select-none hover:text-foreground"
                    )}
                    onClick={sortable && column.isSortable ? column.toggleSorting : undefined}
                    style={{
                      width: column.getSize(),
                      minWidth: column.getMinSize(),
                      maxWidth: column.getMaxSize(),
                    }}
                  >
                    <div className={cn(
                      "flex items-center group",
                      sortable && column.isSortable && "group"
                    )}>
                      {typeof column.header === 'function' 
                        ? column.header({ column })
                        : column.header}
                      {sortable && column.isSortable && (
                        <SortIndicator direction={column.isSorted} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {processedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length + (enableRowSelection ? 1 : 0)} 
                    className="h-24 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-sm font-medium">{noDataMessage || emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                processedData.map((row, rowIndex) => (
                  <tr
                    key={getRowId(row)}
                    className={cn(
                      "border-b transition-colors",
                      hoverable && "cursor-pointer hover:bg-muted/50",
                      striped && rowIndex % 2 === 0 && "bg-muted/5",
                      typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName
                    )}
                    onClick={(e) => onRowClick?.(row, e)}
                  >
                    {enableRowSelection && (
                      <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={!!rowSelection[getRowId(row)]}
                          onChange={() => toggleRowSelection(row)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={`${getRowId(row)}-${column.id}`}
                        className={cn(
                          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                          column.className,
                          column.cellClassName
                        )}
                        style={{
                          width: column.getSize(),
                          minWidth: column.getMinSize(),
                          maxWidth: column.getMaxSize(),
                        }}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {showPagination && enablePagination && pageCount > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t bg-muted/10 px-4 py-3 sm:flex-row sm:gap-0">
          {showPageSizeOptions && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center space-x-6 lg:space-x-8">
            {showPageCount && (
              <div className="text-sm text-muted-foreground">
                Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
                <span className="font-medium">{pageCount}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <PaginationButton
                onClick={() => handlePageChange(0)}
                disabled={pageIndex === 0}
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </PaginationButton>
              <PaginationButton
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </PaginationButton>
              <PaginationButton
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={pageIndex >= pageCount - 1}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </PaginationButton>
              <PaginationButton
                onClick={() => handlePageChange(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </PaginationButton>
            </div>
          </div>
        </div>
      )}

      {footerComponent && (
        <div className="border-t bg-muted/10 px-4 py-3">
          {footerComponent}
        </div>
      )}
    </div>  
  )
}
