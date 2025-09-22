"use client";

import {
  Chip,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useRef, useState } from "react";
import { useAdvocates } from "../hooks/useAdvocates";

export default function TableWithSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching: isLoading } = useAdvocates(
    searchTerm,
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  const advocates = data?.results || [];

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.value || "");
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 50);
  };

  const onClear = () => {
    setSearchTerm("");
  };

  const asPhoneNumber = (phoneNumber: number) => {
    const phoneNumberString = phoneNumber.toString();
    return `(${phoneNumberString.slice(0, 3)}) ${phoneNumberString.slice(
      3,
      6
    )}-${phoneNumberString.slice(6)}`;
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "degree", header: "Degree" },
    {
      accessorKey: "specialties",
      header: "Specialties",
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue<string[]>().map((s) => (
            <Chip size="sm" key={s}>
              {s}
            </Chip>
          ))}
        </div>
      ),
    },
    { accessorKey: "yearsOfExperience", header: "Years of Experience" },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ getValue }) => asPhoneNumber(getValue<number>()),
    },
  ];

  const table = useReactTable({
    data: advocates ?? [],
    columns,
    rowCount: data?.total,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <Table
        aria-label="List of advocates"
        isStriped
        isHeaderSticky
        topContent={
          <Input
            onChange={onChange}
            onClear={onClear}
            id="search-term"
            isClearable
            value={searchTerm}
            aria-label="Search for an advocate"
            label="Search"
            size="sm"
          />
        }
        bottomContent={
          <div className="flex flex-row align-center justify-between gap-5">
            <p className="text-small text-default-500">
              {data?.total ?? 0} advocate{data?.total === 1 ? "" : "s"} found
            </p>
            <Pagination
              color="secondary"
              page={pagination.pageIndex + 1}
              total={data?.total ? Math.ceil(data?.total / data?.pageSize) : 0}
              onChange={(page) =>
                setPagination((old) => ({ ...old, pageIndex: page - 1 }))
              }
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] max-h-[80vh] overflow-auto",
        }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableColumn key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableColumn>
                );
              })}
            </React.Fragment>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? "Loading..." : "No advocates found."}
        >
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
