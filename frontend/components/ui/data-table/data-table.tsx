"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  onSortingChange?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  state?: {
    sorting?: SortingState
    columnFilters?: ColumnFiltersState
    columnVisibility?: VisibilityState
  }
  enablePagination?: boolean
  enableSorting?: boolean
  enableColumnFilters?: boolean
  enableColumnVisibility?: boolean
  enableRowSelection?: boolean
  onRowSelectionChange?: (rows: any) => void
  rowSelection?: Record<string, boolean>
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = -1,
  pagination,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  state,
  enablePagination = true,
  enableSorting = true,
  enableColumnFilters = true,
  enableColumnVisibility = true,
  enableRowSelection = false,
  rowSelection,
  isLoading = false,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [rowSelectionState, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [paginationState, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting: state?.sorting ?? sorting,
      columnFilters: state?.columnFilters ?? columnFilters,
      columnVisibility: state?.columnVisibility ?? columnVisibility,
      rowSelection: rowSelection ?? rowSelectionState,
      pagination: pagination ?? paginationState,
    },
    enableRowSelection: enableRowSelection,
    manualPagination: pageCount > 0,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(pagination ?? paginationState) 
        : updater
      
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      onColumnFiltersChange?.(newFilters)
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater
      setColumnVisibility(newVisibility)
      onColumnVisibilityChange?.(newVisibility)
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection ?? rowSelectionState) : updater
      setRowSelection(newSelection)
      onRowSelectionChange?.(newSelection)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      {(enableColumnFilters || enableColumnVisibility) && (
        <DataTableToolbar table={table} />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyState || "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={[10, 20, 30, 40, 50]} />
      )}
    </div>
  )
}
