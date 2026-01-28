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
import { ChevronDown, MoreVertical, Plus, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

// Column definitions
const productColumns = [
  { name: "Product Name", uid: "productName" },
  { name: "Quantity", uid: "quantity" },
  { name: "Unit Price (₹)", uid: "unitPrice" },
  { name: "Tax (%)", uid: "tax" },
  { name: "Price with Tax (₹)", uid: "priceWithTax" },
  { name: "Total Revenue (₹)", uid: "totalRevenue" },
  { name: "Discount (₹)", uid: "discount" },
  { name: "Category", uid: "category" },
  { name: "Last Sold Date", uid: "lastSoldDate" },
];

// Mock product data

// const products = [
//   {
//     productName: "Laptop",
//     quantity: 25,
//     unitPrice: 60000,
//     tax: 18,
//     priceWithTax: 70800,
//     discount: 1000,
//     category: "Electronics",
//     lastSoldDate: "2025-11-02",
//   },
//   {
//     productName: "Wireless Mouse",
//     quantity: 50,
//     unitPrice: 800,
//     tax: 12,
//     priceWithTax: 896,
//     discount: 50,
//     category: "Accessories",
//     lastSoldDate: "2025-10-30",
//   },
//   {
//     productName: "Headphones",
//     quantity: 40,
//     unitPrice: 1500,
//     tax: 18,
//     priceWithTax: 1770,
//     discount: 100,
//     category: "Electronics",
//     lastSoldDate: "2025-11-01",
//   },
//   {
//     productName: "Printer Cartridge",
//     quantity: 15,
//     unitPrice: 1200,
//     tax: 18,
//     priceWithTax: 1416,
//     discount: 0,
//     category: "Office Supplies",
//     lastSoldDate: "2025-11-03",
//   },
//   {
//     productName: "Office Chair",
//     quantity: 10,
//     unitPrice: 4500,
//     tax: 18,
//     priceWithTax: 5310,
//     discount: 200,
//     category: "Furniture",
//     lastSoldDate: "2025-10-29",
//   },
// ];

// Derived helper
const calculateRevenue = (p) =>
  (p.quantity * p.priceWithTax).toLocaleString("en-IN");

export default function ProductsTable() {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(productColumns.map((c) => c.uid)),
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("productName");
  const [sortDirection, setSortDirection] = useState("asc");

  const productsFromRedux =
    useSelector((state) => state.products.productsList) || [];
  const products = useMemo(() => {
    return productsFromRedux.map((p) => ({
      productName: p.name ?? "Unnamed Product",
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      tax: p.tax,
      priceWithTax: p.priceWithTax,
      discount: p.discount,
      category: p.category,
      lastSoldDate: p.lastSoldDate || "-",
    }));
  }, [productsFromRedux]);

  console.log("here in product tab");
  
  console.log(productsFromRedux, products);
  

  // Filter
  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.productName.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [filterValue]);

  const pages = Math.ceil(filtered.length / rowsPerPage);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, page, rowsPerPage]);

  // Sorting
  const sorted = useMemo(() => {
    return [...paginated].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [paginated, sortColumn, sortDirection]);

  return (
    <div className="p-6 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        {/* Search */}
        <div className="relative sm:max-w-[44%] w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by Product Name..."
            className="pl-8"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
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
              {productColumns.map((col) => (
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
              {productColumns
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
            {sorted.length > 0 ? (
              sorted.map((product, index) => (
                <TableRow key={index}>
                  {productColumns
                    .filter((c) => visibleColumns.has(c.uid))
                    .map((col) => (
                      <TableCell key={col.uid}>
                        {col.uid === "totalRevenue"
                          ? `₹${calculateRevenue(product)}`
                          : col.uid === "unitPrice" ||
                              col.uid === "priceWithTax" ||
                              col.uid === "discount"
                             ? `₹${Number(product[col.uid] ?? 0).toLocaleString("en-IN")}`
                            : col.uid === "tax"
                              ? `${product[col.uid]}%`
                              : product[col.uid] || "-"}
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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {filtered.length} products
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
