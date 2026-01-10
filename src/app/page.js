"use client";
import UploadFile from "@/components/UploadFile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import TableSection from "@/components/TableSection";
import { Upload } from "lucide-react";

export default function Home() {
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
      >
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Invoice Management System
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload and manage invoices, products, and customers in one place.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="shadow-md border-border/60 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="h-5 w-5 text-primary" />
              Upload Documents
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Supported formats: PDF, Images, Excel, CSV
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <UploadFile />

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/30">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Information Card */}

        <TableSection />
      </motion.div>
    </div>
  );
}
