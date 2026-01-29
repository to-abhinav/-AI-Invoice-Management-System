import { gemini } from "./geminiClient";
import { InvoiceSchema } from "../schema/invoiceSchema";
import { normalizeProducts } from "./normalizeInvoice";
import { sanitizeInvoiceData } from "./sanitizeInvoice";
import { parseExcelRows } from "./parseExcelRows";
import { groupInvoices } from "./groupInvoices";
import { buildInvoiceFromRows } from "./buildInvoiceFromRows";


export async function processInvoice({ buffer, mimeType, prompt }) {
  let contents;

  // IMAGE / PDF
  if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
    contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ];
  }

  // EXCEL
  else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
  const rows = parseExcelRows(buffer);
  const groups = groupInvoices(rows);

  const results = [];

  for (const group of groups) {
    const baseInvoice = buildInvoiceFromRows(
      group.rows,
      group.serialNumber
    );

    // // OPTIONAL AI ENRICHMENT
    // const aiResult = await gemini.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: [
    //     { text: "Normalize product names and customer fields." },
    //     { text: JSON.stringify(baseInvoice) },
    //   ],
    // });

    let enriched = baseInvoice;

    // try {
    //   const raw = aiResult.text.replace(/```json|```/g, "").trim();
    //   enriched = { ...baseInvoice, ...JSON.parse(raw) };
    // } catch {
    //   // fallback to deterministic result
    // }

    results.push(enriched);
  }

  return results; // ARRAY of invoices
}

  // TEXT / CSV / DOC
  else {
    const text = buffer.toString("utf8");
    contents = [{ text: `${prompt}\n\n${text}` }];
  }

  const result = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  // console.log("result form gemini", result);
  

  const raw = result.text
    .replace(/```json|```/g, "")
    .replace(/[\u0000-\u001F]+/g, "")
    .trim();
  
  // console.log("raw from gemini "+raw);
  

  let parsed;
try {
  parsed = JSON.parse(raw);
  console.log("json parsed respopnse ", parsed);
  
} catch {
  throw new Error("Invalid JSON returned by AI");
}



parsed.products = normalizeProducts(parsed.products);


parsed = sanitizeInvoiceData(parsed);


const validated = InvoiceSchema.safeParse(parsed);

if (!validated.success) {
  console.error("Schema errors:", validated.error);
  throw new Error("Schema validation failed");
}

  

return validated.data;
}
