import { NextResponse } from "next/server";
import { parseBase64 } from "@/lib/util/parseBase64";
import { processInvoice } from "@/lib/ai/processInvoice";

export async function POST(req) {
  try {
    const { dataUrl, prompt } = await req.json();

    const { buffer, mimeType } = parseBase64(dataUrl);

    const data = await processInvoice({
      buffer,
      mimeType,
      prompt: prompt || "Extract invoice details",
    });

    console.log(data +" *********************from process-file ");
    
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 422 }
    );
  }
}
