export function buildInvoiceFromRows(rows, serialNumber) {
  const products = [];
  let totalAmount = 0;
  let totalTax = 0;
  let quantity = 0;

  const customerName =
    rows[0]["Customer Name"] ||
    rows[0]["Party Name"] ||
    "";

  for (const row of rows) {
    const productName =
      row["Product Name"] ||
      row["Item Name"] ||
      row["Description"];

    const qty = Number(row["Quantity"] || row["Qty"] || 1);
    const unitPrice = Number(row["Unit Price"] || row["Price"] || 0);
    const tax = Number(row["Tax"] || row["GST"] || 0);
    const total = Number(row["Total Amount"] || 0);

    products.push({
      name: productName,
      quantity: qty,
      unitPrice,
      tax,
      priceWithTax: total,
    });

    quantity += qty;
    totalTax += tax;
    totalAmount += total;
  }

  return {
    invoice: {
      serialNumber,
      customerName,
      productName: products[0]?.name || "",
      quantity,
      tax: totalTax,
      totalAmount,
    },
    products,
    customer: {
      name: customerName,
      totalPurchaseAmount: totalAmount,
    },
  };
}
