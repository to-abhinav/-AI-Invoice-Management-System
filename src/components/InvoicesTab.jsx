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
import { ChevronDown, MoreVertical, Search, AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSelector } from "react-redux";

const columns = [
  { name: "S.No", uid: "serial" },
  { name: "Invoice ID", uid: "invoiceId" },
  { name: "Customer Name", uid: "customerName" },
  { name: "Product Name", uid: "productName" },
  { name: "Qty", uid: "quantity" },
  { name: "Tax", uid: "tax" },
  { name: "Total Amount", uid: "totalAmount" },
  { name: "Date", uid: "date" },
];

export default function InvoicesTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(columns.map((c) => c.uid)),
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const invoicesFromRedux =
    useSelector((state) => state.invoices.invoiceList) || [];

  const tableInvoices = useMemo(() => {
    return invoicesFromRedux.map((inv) => ({
      invoiceId: inv.serialNumber,
      customerName: inv.customerName,
      productName: inv.productName,
      quantity: inv.quantity,
      tax: inv.tax,
      totalAmount: inv.totalAmount,
      date: inv.date,
      serial: inv.serialNumber,
    }));
  }, [invoicesFromRedux]);

  // Filter
  const filtered = useMemo(() => {
    return tableInvoices.filter(
      (invoice) =>
        invoice.customerName
          ?.toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        invoice.productName?.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [filterValue]);

  // Sort
  const sorted = useMemo(() => {
    const sortedData = [...filtered].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sortedData;
  }, [filtered, sortColumn, sortDirection]);

  // Paginate
  const pages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sorted.slice(start, end);
  }, [sorted, page, rowsPerPage]);

  // if (tableInvoices.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 space-y-4">
  //       <p className="text-lg text-gray-600">No invoices available.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="relative sm:max-w-[44%] w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by Customer or Product Name..."
            className="pl-8"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
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

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((c) => visibleColumns.has(c.uid))
                .map((col) => (
                  <TableHead
                    key={col.uid}
                    className="cursor-pointer"
                    onClick={() => {
                      if (col.uid === "serial") return;
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
            {paginated.length > 0 ? (
              paginated.map((invoice, index) => (
                <TableRow key={index}>
                  {columns
                    .filter((c) => visibleColumns.has(c.uid))
                    .map((col) => (
                      <TableCell key={col.uid}>
                        {/* Missing Data Indicator */}
                        {col.uid === "serial" ? (
                          (page - 1) * rowsPerPage + index + 1
                        ) : !invoice[col.uid] || invoice[col.uid] === "" ? (
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Missing
                          </div>
                        ) : col.uid === "totalAmount" ? (
                          `₹${invoice[col.uid].toLocaleString("en-IN")}`
                        ) : (
                          invoice[col.uid]
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
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {filtered.length} invoices
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
                className={
                  page === pages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
