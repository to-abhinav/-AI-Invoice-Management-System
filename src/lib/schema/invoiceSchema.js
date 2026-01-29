import { z } from "zod";

/**
 * Accept numbers OR numeric strings
 */
const Num = z.coerce.number().nonnegative();

export const InvoiceSchema = z.object({
  invoices: z.array(
    z.object({
      id: z.string().min(1),
      serialNumber: z.string().optional().default(""),
      date: z.string().optional().default(""),

      customerId: z.string().min(1),
      customerName: z.string().optional().default(""),
      customerCompany: z.string().optional().default(""),
      customerGSTIN: z.string().optional().default(""),

      supplierGSTIN: z.string().optional().default(""),
      placeOfSupply: z.string().optional().default(""),

      items: z.array(
        z.object({
          productId: z.string().min(1),
          productName: z.string().min(1),
          quantity: Num,
          unit: z.string().min(1),
          unitPrice: Num,
          taxRate: Num,
          taxableValue: Num,
          gstAmount: Num,
          priceWithTax: Num,
          totalAmount: Num,
        })
      ).min(1),

      charges: z
        .object({
          makingCharges: Num.default(0),
          shippingCharges: Num.default(0),
          debitCardCharges: Num.default(0),
          otherCharges: Num.default(0),
        })
        .optional(),

      totalItems: Num,
      totalQuantity: Num,
      taxableAmount: Num,
      cgst: Num,
      sgst: Num,
      igst: Num,
      totalTax: Num,
      subtotal: Num,
      discount: Num.default(0),
      roundOff: Num.default(0),
      grandTotal: Num,
      amountPayable: Num,

      status: z.enum(["pending", "paid", "cancelled"]),

      paymentDetails: z
        .object({
          bank: z.string().optional().default(""),
          accountNumber: z.string().optional().default(""),
          ifscCode: z.string().optional().default(""),
          branch: z.string().optional().default(""),
          beneficiaryName: z.string().optional().default(""),
          upiEnabled: z.boolean().default(false),
        })
        .optional(),
    })
  ),

  products: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      unit: z.string().min(1),
      unitPrice: Num,
      taxRate: Num,
      priceWithTax: Num,
      discount: Num.default(0),
      totalSold: Num,
      totalRevenue: Num,
      category: z.string().optional(),
      lastSoldDate: z.string().optional().default(""),
    })
  ),

  customers: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      company: z.string().optional().default(""),
      gstin: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      email: z.string().optional().default(""),
      totalPurchaseAmount: Num,
      totalInvoices: Num,
      purchaseDate: z.string().optional().default(""),
      status: z.enum(["active", "inactive"]),
      validationErrors: z.array(z.string()).default([]),
    })
  ),

  metadata: z.object({
    totalInvoices: Num,
    totalProducts: Num,
    totalCustomers: Num,
    totalRevenue: Num,
    totalTax: Num,
    extractionDate: z.string(),
    sourceFile: z.string().optional().default(""),
    validationStatus: z.enum(["complete", "partial", "failed"]),
    missingFields: z.array(z.string()).default([]),
    warnings: z.array(z.string()).default([]),
  }),
});
