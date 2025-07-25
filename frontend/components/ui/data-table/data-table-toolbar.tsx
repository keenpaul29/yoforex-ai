"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  filterOptions?: {
    label: string
    value: string
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterOptions = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {searchKey && (
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={`Filter ${searchKey}...`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <span className="sr-only">Reset filters</span>
            </Button>
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {filterOptions.map((filter) => {
          const column = table.getColumn(filter.value)
          if (!column) return null
          
          return (
            <DropdownMenu key={filter.value}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {filter.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by {filter.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filter.options.map((option) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      className="capitalize"
                      checked={column?.getFilterValue() === option.value}
                      onCheckedChange={() =>
                        column?.setFilterValue(option.value === "all" ? "" : option.value)
                      }
                    >
                      {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
