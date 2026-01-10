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
  // Invoice
  const inv = data.invoice;
  inv.quantity = toNumber(inv.quantity);
  inv.totalAmount = toNumber(inv.totalAmount);
  inv.tax = toNumber(inv.tax);

  if (inv.additionalCharges) {
    for (const key of Object.keys(inv.additionalCharges)) {
      inv.additionalCharges[key] = toNumber(inv.additionalCharges[key]);
    }
  }

  // Products
  data.products = data.products.map((p) => ({
    ...p,
    quantity: toNumber(p.quantity),
    unitPrice: toNumber(p.unitPrice),
    discount: toNumber(p.discount),
    tax: toNumber(p.tax),
    priceWithTax: toNumber(p.priceWithTax),
  }));

  // Customer
  if (data.customer) {
    data.customer.totalPurchaseAmount = toNumber(
      data.customer.totalPurchaseAmount
    );
  }

  return data;
}
