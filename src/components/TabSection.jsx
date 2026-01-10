"use client";
import { AppWindowIcon, CodeIcon, Newspaper, Package, PartyPopper, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import  CustomersTab  from "./CustomersTab";
import InvoicesTab from "./InvoicesTab";
import ProductsTable from "./ProductsTab";

export function TabSection() {
  return (
    <div className="flex w-full max-w-full flex-col gap-6">
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices"><Newspaper/>Invoices</TabsTrigger>
          <TabsTrigger value="products"><Package/>Products</TabsTrigger>
          <TabsTrigger value="customers"><Users/>Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            {/* <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Make changes to your invoices here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
               
              </div>
              <div className="grid gap-3">
               
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter> */}
            <InvoicesTab />
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            {/* <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Make changes to your products here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
               
              </div>
              <div className="grid gap-3">
               
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter> */}
            <ProductsTable />
          </Card>
        </TabsContent>
        <TabsContent value="customers">
          <Card>
            {/* <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your customers here. After saving, you&apos;ll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
               
              </div>
              <div className="grid gap-3">
              
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
            <CustomersTab />

          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
