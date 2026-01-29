export function normalizeProducts(products = []) {
  const map = new Map();

  for (const product of products) {
    const key = product.name.toLowerCase().trim();

    if (!map.has(key)) {
      map.set(key, { ...product });
    } else {
      const existing = map.get(key);

      existing.totalSold += product.totalSold;
      existing.taxRate += product.taxRate;
      existing.priceWithTax += product.priceWithTax;
    }
  }

  return Array.from(map.values());
}
