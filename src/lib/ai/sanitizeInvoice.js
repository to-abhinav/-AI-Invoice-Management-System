function toNumber(value) {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }

  return 0;
}

export function sanitizeInvoiceData(data) {
 
  data.invoices = (data.invoices || []).map((inv) => {
    if (inv.charges) {
      for (const key of Object.keys(inv.charges)) {
        inv.charges[key] = toNumber(inv.charges[key]);
      }
    }

    inv.taxableAmount = toNumber(inv.taxableAmount);
    inv.cgst = toNumber(inv.cgst);
    inv.sgst = toNumber(inv.sgst);
    inv.igst = toNumber(inv.igst);
    inv.totalTax = toNumber(inv.totalTax);
    inv.subtotal = toNumber(inv.subtotal);
    inv.discount = toNumber(inv.discount);
    inv.roundOff = toNumber(inv.roundOff);
    inv.grandTotal = toNumber(inv.grandTotal);
    inv.amountPayable = toNumber(inv.amountPayable);
    inv.totalQuantity = toNumber(inv.totalQuantity);
    inv.totalItems = toNumber(inv.totalItems);

    // Items
    inv.items = (inv.items || []).map((item) => ({
      ...item,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      taxRate: toNumber(item.taxRate),
      taxableValue: toNumber(item.taxableValue),
      gstAmount: toNumber(item.gstAmount),
      priceWithTax: toNumber(item.priceWithTax),
      totalAmount: toNumber(item.totalAmount),
    }));

    return inv;
  });

 
  data.products = (data.products || []).map((p) => ({
    ...p,
    unitPrice: toNumber(p.unitPrice),
    taxRate: toNumber(p.taxRate),
    priceWithTax: toNumber(p.priceWithTax),
    discount: toNumber(p.discount),
    totalSold: toNumber(p.totalSold),
    totalRevenue: toNumber(p.totalRevenue),
  }));

  
  data.customers = (data.customers || []).map((c) => ({
    ...c,
    totalPurchaseAmount: toNumber(c.totalPurchaseAmount),
    totalInvoices: toNumber(c.totalInvoices),
  }));


  if (data.metadata) {
    data.metadata.totalInvoices = toNumber(data.metadata.totalInvoices);
    data.metadata.totalProducts = toNumber(data.metadata.totalProducts);
    data.metadata.totalCustomers = toNumber(data.metadata.totalCustomers);
    data.metadata.totalRevenue = toNumber(data.metadata.totalRevenue);
    data.metadata.totalTax = toNumber(data.metadata.totalTax);
  }

  return data;
}
