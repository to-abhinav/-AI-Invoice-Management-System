"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  MoreVertical,
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

/* =========================
   COLUMN CONFIG
========================= */
const customerColumns = [
  { name: "Customer Name", uid: "customerName" },
  { name: "Phone Number", uid: "phone" },
  { name: "Email", uid: "email" },
  { name: "Total Amount (₹)", uid: "totalAmount" },
  { name: "Purchase Date", uid: "purchaseDate" },
];

export default function CustomersTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(customerColumns.map((c) => c.uid)),
  );
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [sortColumn, setSortColumn] = useState("customerName");
  const [sortDirection, setSortDirection] = useState("asc");

  /* =========================
     1️⃣ READ FROM REDUX (CORRECT)
  ========================== */
  const customersFromRedux =
    useSelector((state) => state.customers.customerList) || [];

  console.log("*****************");
  
  console.log(customersFromRedux);
  

  /* =========================
     2️⃣ MAP REDUX → TABLE SHAPE
  ========================== */
  const tableCustomers = useMemo(() => {
    return customersFromRedux.map((c) => ({
      id: c.id,
      customerName: c.name || "",
      phone: c.phoneNumber || "",
      email: c.email || "",
      totalAmount: Number(c.totalPurchaseAmount || 0),
      purchaseDate: c.purchaseDate || "-",
    }));
  }, [customersFromRedux]);

  /* =========================
     3️⃣ FILTER
  ========================== */
  const filtered = useMemo(() => {
    return tableCustomers.filter(
      (c) =>
        c.customerName.toLowerCase().includes(filterValue.toLowerCase()) ||
        c.phone.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [tableCustomers, filterValue]);

  /* =========================
     4️⃣ SORT
  ========================== */
  const sorted = useMemo(() => {
    const data = [...filtered].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortColumn, sortDirection]);

  /* =========================
     5️⃣ PAGINATE
  ========================== */
  const pages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page]);

  /* =========================
     EMPTY STATE
  ========================== */
  // if (tableCustomers.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 space-y-4">
  //       <p className="text-lg text-gray-600">No customers available.</p>
  //     </div>
  //   );
  // }

  /* =========================
     UI
  ========================== */
  return (
    <div className="p-6 space-y-4">
      {/* TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        {/* SEARCH */}
        <div className="relative sm:max-w-[44%] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            className="pl-8"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* COLUMN VISIBILITY */}
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
                  checked ? next.add(col.uid) : next.delete(col.uid);
                  setVisibleColumns(next);
                }}
              >
                {col.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLE */}
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
                          : "asc",
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
            {paginated.map((customer) => (
              <TableRow key={customer.id}>
                {customerColumns
                  .filter((c) => visibleColumns.has(c.uid))
                  .map((col) => (
                    <TableCell key={col.uid}>
                      {(!customer[col.uid] &&
                        ["phone", "email"].includes(col.uid)) ? (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
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
