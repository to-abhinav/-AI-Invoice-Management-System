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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, MoreVertical, Search } from "lucide-react";
import { useSelector } from "react-redux";

/* ---------------------------------------------
   Column Configuration
--------------------------------------------- */

const columns = [
  { name: "S.No", uid: "serial", scope: "invoice" },
  { name: "Invoice ID", uid: "invoiceId", scope: "invoice" },
  { name: "Customer Name", uid: "customerName", scope: "invoice" },
  { name: "Date", uid: "date", scope: "invoice" },

  { name: "Product Name", uid: "productName", scope: "item" },
  { name: "Qty", uid: "quantity", scope: "item" },
  { name: "Price", uid: "unitPrice", scope: "item" },
  { name: "Tax", uid: "gstAmount", scope: "item" },
  { name: "Total Amount", uid: "totalAmount", scope: "item" },
];

export default function InvoicesTable() {
  /* ---------------------------------------------
     State
  --------------------------------------------- */

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(columns.map((c) => c.uid))
  );

  const invoicesFromRedux =
    useSelector((state) => state.invoices.invoiceList) || [];

  /* ---------------------------------------------
     Normalize invoices (DO NOT FLATTEN)
  --------------------------------------------- */

  const invoices = useMemo(() => {
    return invoicesFromRedux.map((inv) => ({
      id: inv.id,
      serialNumber: inv.serialNumber,
      customerName: inv.customerName,
      date: inv.date,
      items: inv.items || [],
    }));
  }, [invoicesFromRedux]);

  /* ---------------------------------------------
     Filter (Invoice + Item level)
  --------------------------------------------- */

  const filteredInvoices = useMemo(() => {
    if (!filterValue.trim()) return invoices;

    const q = filterValue.toLowerCase();

    return invoices.filter((inv) => {
      const invoiceMatch =
        inv.customerName?.toLowerCase().includes(q) ||
        inv.serialNumber?.toLowerCase().includes(q);

      const itemMatch = inv.items.some((item) =>
        item.productName?.toLowerCase().includes(q)
      );

      return invoiceMatch || itemMatch;
    });
  }, [invoices, filterValue]);

  /* ---------------------------------------------
     Pagination (Invoice-based)
  --------------------------------------------- */

  const pages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);

  /* ---------------------------------------------
     Render
  --------------------------------------------- */

  return (
    <div className="p-6 space-y-4">
      {/* ---------------------------------------------
          Top Controls
      --------------------------------------------- */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="relative sm:max-w-[44%] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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

      {/* ---------------------------------------------
          Table
      --------------------------------------------- */}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((c) => visibleColumns.has(c.uid))
                .map((col) => (
                  <TableHead key={col.uid}>{col.name}</TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice, invoiceIndex) =>
                invoice.items.map((item, itemIndex) => (
                  <TableRow
                    key={`${invoice.id}-${item.productId}`}
                    className={itemIndex === 0 ? "bg-muted/20" : ""}
                  >
                    {/* -----------------------------
                        Invoice-level cells (rowSpan)
                    ----------------------------- */}
                    {itemIndex === 0 && visibleColumns.has("serial") && (
                      <TableCell rowSpan={invoice.items.length}>
                        {(page - 1) * rowsPerPage + invoiceIndex + 1}
                      </TableCell>
                    )}

                    {itemIndex === 0 && visibleColumns.has("invoiceId") && (
                      <TableCell rowSpan={invoice.items.length}>
                        {invoice.serialNumber}
                      </TableCell>
                    )}

                    {itemIndex === 0 && visibleColumns.has("customerName") && (
                      <TableCell rowSpan={invoice.items.length}>
                        {invoice.customerName}
                      </TableCell>
                    )}

                    {itemIndex === 0 && visibleColumns.has("date") && (
                      <TableCell rowSpan={invoice.items.length}>
                        {invoice.date}
                      </TableCell>
                    )}

                    {/* -----------------------------
                        Item-level cells
                    ----------------------------- */}

                    {visibleColumns.has("productName") && (
                      <TableCell>{item.productName}</TableCell>
                    )}

                    {visibleColumns.has("quantity") && (
                      <TableCell>{item.quantity}</TableCell>
                    )}

                    {visibleColumns.has("unitPrice") && (
                      <TableCell>
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </TableCell>
                    )}

                    {visibleColumns.has("gstAmount") && (
                      <TableCell>
                        ₹{item.gstAmount.toLocaleString("en-IN")}
                      </TableCell>
                    )}

                    {visibleColumns.has("totalAmount") && (
                      <TableCell className="font-medium">
                        ₹{item.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                    )}

                    {/* -----------------------------
                        Actions (once per invoice)
                    ----------------------------- */}
                    {itemIndex === 0 && (
                      <TableCell rowSpan={invoice.items.length}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
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
                    )}
                  </TableRow>
                ))
              )
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

      {/* ---------------------------------------------
          Pagination
      --------------------------------------------- */}

      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedInvoices.length} of {filteredInvoices.length} invoices
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
