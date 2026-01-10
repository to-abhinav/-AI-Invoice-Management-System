import { gemini } from "./geminiClient";
import { excelToText } from "./excelToText";
import { InvoiceSchema } from "../schema/invoiceSchema";
import { normalizeProducts } from "./normalizeInvoice";
import { sanitizeInvoiceData } from "./sanitizeInvoice";


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
  else if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet")
  ) {
    const extractedText = excelToText(buffer);
    contents = [{ text: `${prompt}\n\n${extractedText}` }];
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


  const raw = result.text
    .replace(/```json|```/g, "")
    .replace(/[\u0000-\u001F]+/g, "")
    .trim();
  
  console.log(raw);
  

  let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  throw new Error("Invalid JSON returned by AI");
}


// Normalize duplicates FIRST
parsed.products = normalizeProducts(parsed.products);

// Sanitize numeric fields SECOND
parsed = sanitizeInvoiceData(parsed);

// Validate LAST
const validated = InvoiceSchema.safeParse(parsed);

if (!validated.success) {
  console.error("Schema errors:", validated.error.format());
  throw new Error("Schema validation failed");
}

  

return validated.data;
}
