import { NextResponse } from "next/server";
import { gemini } from "@/lib/ai/geminiClient";

export async function POST(req) {
  try {
    const { excelJsonData, prompt } = await req.json();

    let contents = [
      { text: prompt },
      { text: JSON.stringify(excelJsonData, null, 2) },
    ];

    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

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

    // console.log("from process-excel:\n", JSON.stringify(parsed, null, 2));

    return NextResponse.json({
      invoices: Array.isArray(parsed) ? parsed : [parsed],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 422 });
  }
}
