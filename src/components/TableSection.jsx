"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paperclip } from "lucide-react";
import { TabSection } from "@/components/TabSection";

export default function TableSection() {
  return (
    <Card className="shadow-md border-border/60 backdrop-blur-sm mt-2">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Paperclip className="h-5 w-5 text-primary" />
          Extracted Data Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-1">
        <TabSection />
      </CardContent>
    </Card>
  );
}
