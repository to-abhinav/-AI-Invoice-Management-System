"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  MoreVertical,
  Plus,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

// Define columns
const customerColumns = [
  { name: "Customer Name", uid: "customerName" },
  { name: "Phone Number", uid: "phone" },
  { name: "Email", uid: "email" },
  { name: "Total Amount (₹)", uid: "totalAmount" },
  { name: "Purchase Date", uid: "purchaseDate" },
];

// Sample mock data
const customers = [
  {
    customerName: "Rohit Sharma",
    phone: "9876543210",
    email: "rohit.sharma@example.com",
    totalAmount: 142500,
    purchaseDate: "2025-11-02",
  },
  {
    customerName: "Priya Mehta",
    phone: "9823456712",
    email: "",
    totalAmount: 8700,
    purchaseDate: "2025-10-28",
  },
  {
    customerName: "Vikas Gupta",
    phone: "",
    email: "vikas.g@example.com",
    totalAmount: 29999,
    purchaseDate: "2025-11-03",
  },
  {
    customerName: "Sneha Patel",
    phone: "9812234567",
    email: "sneha.patel@example.com",
    totalAmount: 12100,
    purchaseDate: "2025-10-30",
  },
  {
    customerName: "Arjun Reddy",
    phone: "",
    email: "",
    totalAmount: 4500,
    purchaseDate: "2025-11-01",
  },
  {
    customerName: "Arjun Reddy",
    phone: "",
    email: "",
    totalAmount: 4500,
    purchaseDate: "2025-11-01",
  },
  {
    customerName: "Arjun Reddy",
    phone: "",
    email: "",
    totalAmount: 4500,
    purchaseDate: "2025-11-01",
  },
  {
    customerName: "Arjun Reddy",
    phone: "",
    email: "",
    totalAmount: 4500,
    purchaseDate: "2025-11-01",
  },
];

export default function CustomersTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(customerColumns.map((c) => c.uid))
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("customerName");
  const [sortDirection, setSortDirection] = useState("asc");

  // 1️⃣ Filter
  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.customerName.toLowerCase().includes(filterValue.toLowerCase()) ||
        c.phone.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue]);

  // 2️⃣ Sort full filtered data
  const sorted = useMemo(() => {
    const sortedData = [...filtered].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sortedData;
  }, [filtered, sortColumn, sortDirection]);

  // 3️⃣ Then paginate
  const pages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sorted.slice(start, end);
  }, [sorted, page, rowsPerPage]);

  return (
    <div className="p-6 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        {/* Search */}
        <div className="relative sm:max-w-[44%] w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-8"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setPage(1); // reset to first page on new search
            }}
          />
        </div>

        <div className="flex gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {customerColumns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.uid}
                  checked={visibleColumns.has(col.uid)}
                  onCheckedChange={(checked) => {
                    const next = new Set(visibleColumns);
                    if (checked) next.add(col.uid);
                    else next.delete(col.uid);
                    setVisibleColumns(next);
                  }}
                >
                  {col.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

         
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {customerColumns
                .filter((c) => visibleColumns.has(c.uid))
                .map((col) => (
                  <TableHead
                    key={col.uid}
                    className="cursor-pointer"
                    onClick={() => {
                      setSortColumn(col.uid);
                      setSortDirection((prev) =>
                        sortColumn === col.uid && prev === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                  >
                    {col.name}
                    {sortColumn === col.uid && (
                      <span className="ml-1 text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((customer, index) => (
                <TableRow key={index}>
                  {customerColumns
                    .filter((c) => visibleColumns.has(c.uid))
                    .map((col) => (
                      <TableCell key={col.uid}>
                        {/* Missing data indicator */}
                        {(!customer[col.uid] || customer[col.uid] === "") &&
                        ["phone", "email"].includes(col.uid) ? (
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Missing
                          </div>
                        ) : col.uid === "totalAmount" ? (
                          `₹${customer[col.uid].toLocaleString("en-IN")}`
                        ) : (
                          customer[col.uid] || "-"
                        )}
                      </TableCell>
                    ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.size + 1}
                  className="text-center"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {filtered.length} customers
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className={page === pages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
