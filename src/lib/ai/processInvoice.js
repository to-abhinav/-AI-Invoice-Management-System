import { gemini } from "./geminiClient";
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
  console.log("json parsed respopnse in processInvoice", parsed);
  
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
