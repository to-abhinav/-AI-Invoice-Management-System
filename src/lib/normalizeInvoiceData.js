export function normalizeInvoiceData(rawInvoices) {
  const invoicesTable = [];
  const customersMap = new Map();
  const productsMap = new Map();

  rawInvoices.forEach((entry, index) => {
    const { invoice, customer, products } = entry;

    invoicesTable.push({
      serial: index + 1,
      invoiceId: invoice.serialNumber || "-",
      customerName: invoice.customerName || "-",
      productName: invoice.productName || "-",
      quantity: Number(invoice.quantity) || 0,
      tax: Number(invoice.tax) || 0,
      totalAmount: Number(invoice.totalAmount) || 0,
      date: invoice.date || "",
    });

    const custKey = invoice.customerName || customer.name || "UNKNOWN";

    if (!customersMap.has(custKey)) {
      customersMap.set(custKey, {
        customerName: customer.name || "-",
        phone: customer.phoneNumber || "",
        email: customer.email || "",
        totalAmount: Number(customer.totalPurchaseAmount) || 0,
        purchaseDate: invoice.date || "",
      });
    } else {
      customersMap.get(custKey).totalAmount +=
        Number(customer.totalPurchaseAmount) || 0;
    }

    products.forEach((p) => {
      const prodKey = p.name;

      const revenue = (Number(p.quantity) || 0) * (Number(p.priceWithTax) || 0);

      if (!productsMap.has(prodKey)) {
        productsMap.set(prodKey, {
          productName: p.name || "-",
          quantity: Number(p.quantity) || 0,
          unitPrice: Number(p.unitPrice) || 0,
          tax: Number(p.tax) || 0,
          priceWithTax: Number(p.priceWithTax) || 0,
          discount: Number(p.discount) || 0,
          totalRevenue: revenue,
          lastSoldDate: invoice.date || "",
        });
      } else {
        const existing = productsMap.get(prodKey);
        existing.quantity += Number(p.quantity) || 0;
        existing.totalRevenue += revenue;
        existing.lastSoldDate = invoice.date || existing.lastSoldDate;
      }
    });
  });

  return {
    invoicesTable,
    customersTable: Array.from(customersMap.values()),
    productsTable: Array.from(productsMap.values()),
  };
}
