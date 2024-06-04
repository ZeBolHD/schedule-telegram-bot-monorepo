"use client";

import { Dispatch, useState } from "react";
import {
  PaginationState,
  RowSelectionState,
  Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Teacher } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import columns from "./columns";

interface TableProps {
  teachers: Teacher[];
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}

const TeachersTable = ({ teachers, page, setPage, pageCount }: TableProps) => {
  const table = useReactTable({
    data: teachers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="rounded-md border mt-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white bg-transparent">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.getIsSelected() ? "bg-zinc-700" : "hover:bg-zinc-900"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            className="text-black"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            className="text-black"
            onClick={() => setPage(page + 1)}
            disabled={page === pageCount}
          >
            Вперед
          </Button>
        </div>
      </div>
    </>
  );
};

export default TeachersTable;
