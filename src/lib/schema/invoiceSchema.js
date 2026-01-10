import { z } from "zod";

/**
 * Accepts numbers OR numeric strings
 */
const Num = z.coerce.number().nonnegative();

/**
 * Product Schema
 */
const ProductSchema = z.object({
  name: z.string().min(1),

  quantity: Num,
  unitPrice: Num,

  discount: Num.optional().default(0),
  tax: Num.optional().default(0),

  priceWithTax: Num,
});

/**
 * Invoice Schema
 */
export const InvoiceSchema = z.object({
  invoice: z.object({
    serialNumber: z.string().optional().default(""),
    date: z.string().optional().default(""),
    customerName: z.string().optional().default(""),
    productName: z.string().optional().default(""),

    quantity: Num,
    totalAmount: Num,
    tax: Num,

    additionalCharges: z
      .object({
        makingCharges: Num.default(0),
        debitCardCharges: Num.default(0),
        shippingCharges: Num.default(0),
        otherCharges: Num.default(0),
      })
      .optional(),
  }),

  products: z.array(ProductSchema).min(1),

  customer: z
    .object({
      name: z.string().optional().default(""),
      phoneNumber: z.string().optional().default(""),
      totalPurchaseAmount: Num,
    })
    .optional(),
});
