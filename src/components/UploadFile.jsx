"use client";

import { useState } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CheckCircle2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import {
  addInvoice,
  setError as setInvoiceError,
} from "@/store/slices/invoiceSlice";
import { addProduct } from "@/store/slices/productsSlice";
import { addCustomer } from "@/store/slices/customerSlice";
import DebugRedux from "./ReduxButton";
import { excelToJsonStrict } from "@/lib/ai/excelToJsonStrict";
import isExcel from "@/lib/ai/isExcel";

const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

export default function FileUpload() {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  // OUTPUT STATE
  const [output, setOutput] = useState(null);

  /* =========================
     FILE READING (REAL)
  ========================== */
  const readAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 30); // 0 → 30
          setProgress(percent);
        }
      };

      reader.onload = () => {
        setProgress(30);
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* =========================
     UPLOAD WITH PROGRESS
  ========================== */
  const postWithProgress = (url, body) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = 30 + Math.round((e.loaded / e.total) * 30); // 30 → 60
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(JSON.parse(xhr.responseText)?.error));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(JSON.stringify(body));
    });

  /* =========================
     AI PROCESSING SIMULATION
  ========================== */
  const simulateProcessing = () => {
    let current = 60;
    return setInterval(() => {
      current += 1;
      setProgress((p) => (p < 90 ? current : p));
    }, 300);
  };

  /* =========================
     MAIN HANDLER
  ========================== */
  const handleFile = async (selectedFile) => {
    try {
      reset();
      setError("");
      setFile(selectedFile);
      setOutput(null);
      setProgress(0);
      setStatus(STATUS.UPLOADING);

      var response;

      if (await isExcel(selectedFile)) {
        console.log("the file uploaded is excel");

        const excelJsonData = await excelToJsonStrict(selectedFile);
        console.log("excel to json data", excelJsonData);

        setStatus(STATUS.PROCESSING);
        response = await postWithProgress("/api/process-excel", {
          excelJsonData,
          prompt: `You are an invoice data extraction AI. Extract structured data from invoice inputs (PDF text, Excel rows, OCR text from images, or mixed files).

Return ONLY a valid JSON object. Do not include explanations, markdown, or extra text.

Output must strictly follow this schema:

{
  "invoices": [
    {
      "id": "string (unique invoice identifier)",
      "serialNumber": "string (invoice number from document)",
      "date": "string (YYYY-MM-DD format)",
      "customerId": "string (reference to customer.id)",
      "customerName": "string",
      "customerCompany": "string (company name if available)",
      "customerGSTIN": "string (GSTIN/Tax ID if available)",
      "supplierGSTIN": "string (supplier's GSTIN if available)",
      "placeOfSupply": "string (state/location)",
      "items": [
        {
          "productId": "string (reference to product.id)",
          "productName": "string",
          "quantity": number,
          "unit": "string (PCS, CASE, SQF, KG, etc.)",
          "unitPrice": number (price without tax),
          "taxRate": number (tax percentage: 0, 5, 12, 18, 28 etc.)",
          "taxableValue": number (quantity × unitPrice),
          "gstAmount": number (tax amount for this item)",
          "priceWithTax": number (unitPrice including tax)",
          "totalAmount": number (quantity × priceWithTax)
          
        }
      ],
      "charges": {
        "makingCharges": number,
        "shippingCharges": number,
        "debitCardCharges": number,
        "otherCharges": number
      },
      "totalItems": number (count of distinct products),
      "totalQuantity": number (sum of all quantities),
      "taxableAmount": number (sum before tax),
      "cgst": number (Central GST total),
      "sgst": number (State GST total),
      "igst": number (Integrated GST total),
      "totalTax": number (cgst + sgst + igst),
      "subtotal": number (sum of items before charges),
      "discount": number,
      "grandTotal": number (final payable amount),
      "amountPayable": number (same as grandTotal),
      "status": "string (pending, paid, cancelled)",
      "paymentDetails": {
        "bank": "string",
        "accountNumber": "string",
        "ifscCode": "string",
        "branch": "string",
        "beneficiaryName": "string",
        "upiEnabled": boolean
      }
    }
  ],
  "products": [
    {
      "id": "string (unique product identifier, e.g., product_001)",
      "name": "string (normalized product name)",
      "unit": "string (PCS, CASE, SQF, KG, etc.)",
      "unitPrice": number (base price without tax)",
      "taxRate": number (GST percentage)",
      "priceWithTax": number (price including tax)",
      "discount": number (amount of discounted price it will be a number deducted from base price,find disc written anywhere)",
      "totalSold": number (sum of quantities across all invoices)",
      "totalRevenue": number (sum of revenue from all invoices)"
      "lastSoldDate": "string (YYYY-MM-DD of last sale, if not available use invoice date)"
      "category": "string (type or category of the product || give unknown if it cannot be determined)"
    }
  ],
  "customers": [
    {
      "id": "string (unique customer identifier, e.g., customer_001)",
      "name": "string (customer name)",
      "company": "string (company name if available)",
      "gstin": "string (GSTIN/Tax ID if available)",
      "phone": "string (phone number if available)",
      "email": "string (email if available)",
      "totalPurchaseAmount": number (sum of all invoice totals)",
      "totalInvoices": number (count of invoices)",
      "status": "string (active, inactive)",
      "validationErrors": ["array of missing field names"],
      "purchaseDate": "string (YYYY-MM-DD of last purchase, if not available use invoice date)"
    }
  ],
  "metadata": {
    "totalInvoices": number,
    "totalProducts": number,
    "totalCustomers": number,
    "totalRevenue": number,
    "totalTax": number,
    "extractionDate": "string (ISO 8601 timestamp)",
    "sourceFile": "string (filename)",
    "validationStatus": "string (complete, partial, failed)",
    "missingFields": ["array of missing critical fields"],
    "warnings": ["array of extraction warnings/notes"]
  }
}w

Rules:
- If the same invoice number appears multiple times, group all items into ONE invoice.
- Normalize product and customer names (case-insensitive, remove duplicates).
- Maintain relationships using consistent IDs.
- Use "" for missing text fields and 0 for missing numeric fields.
- Add missing field names to validationErrors and metadata.missingFields.
- Calculate all prices and taxes accurately:
  taxableValue = quantity × unitPrice
  gstAmount = taxableValue × (taxRate / 100)
  priceWithTax = unitPrice × (1 + taxRate / 100)
  totalAmount = quantity × priceWithTax
- If only total GST is given, split equally into CGST and SGST for intra-state, or assign to IGST for inter-state.
- Determine status using keywords: PAID, PENDING, CANCELLED, DUE (default: pending).
- Dates must be converted to YYYY-MM-DD.
- Ensure all totals match mathematically.
- JSON must be valid and parsable.

Now extract data from the following invoice input:
`,
        });
      } else {
        console.log("not excel xxxxxxxx");

        const dataUrl = await readAsBase64(selectedFile);
        // 2️⃣ Upload + AI processing
        setStatus(STATUS.PROCESSING);

        response = await postWithProgress("/api/process-file", {
          dataUrl,
          prompt: `You are an invoice data extraction AI. Extract structured data from invoice inputs (PDF text, Excel rows, OCR text from images, or mixed files).

Return ONLY a valid JSON object. Do not include explanations, markdown, or extra text.

Output must strictly follow this schema:

{
  "invoices": [
    {
      "id": "string (unique invoice identifier)",
      "serialNumber": "string (invoice number from document)",
      "date": "string (YYYY-MM-DD format)",
      "customerId": "string (reference to customer.id)",
      "customerName": "string",
      "customerCompany": "string (company name if available)",
      "customerGSTIN": "string (GSTIN/Tax ID if available)",
      "supplierGSTIN": "string (supplier's GSTIN if available)",
      "placeOfSupply": "string (state/location)",
      "items": [
        {
          "productId": "string (reference to product.id)",
          "productName": "string",
          "quantity": number,
          "unit": "string (PCS, CASE, SQF, KG, etc.)",
          "unitPrice": number (price without tax),
          "taxRate": number (tax percentage: 0, 5, 12, 18, 28 etc.)",
          "taxableValue": number (quantity × unitPrice),
          "gstAmount": number (tax amount for this item)",
          "priceWithTax": number (unitPrice including tax)",
          "totalAmount": number (quantity × priceWithTax)
          
        }
      ],
      "charges": {
        "makingCharges": number,
        "shippingCharges": number,
        "debitCardCharges": number,
        "otherCharges": number
      },
      "totalItems": number (count of distinct products),
      "totalQuantity": number (sum of all quantities),
      "taxableAmount": number (sum before tax),
      "cgst": number (Central GST total),
      "sgst": number (State GST total),
      "igst": number (Integrated GST total),
      "totalTax": number (cgst + sgst + igst),
      "subtotal": number (sum of items before charges),
      "discount": number,
      "grandTotal": number (final payable amount),
      "amountPayable": number (same as grandTotal),
      "status": "string (pending, paid, cancelled)",
      "paymentDetails": {
        "bank": "string",
        "accountNumber": "string",
        "ifscCode": "string",
        "branch": "string",
        "beneficiaryName": "string",
        "upiEnabled": boolean
      }
    }
  ],
  "products": [
    {
      "id": "string (unique product identifier, e.g., product_001)",
      "name": "string (normalized product name)",
      "unit": "string (PCS, CASE, SQF, KG, etc.)",
      "unitPrice": number (base price without tax)",
      "taxRate": number (GST percentage)",
      "priceWithTax": number (price including tax)",
      "discount": number (amount of discounted price it will be a number deducted from base price,find disc written anywhere)",
      "totalSold": number (sum of quantities across all invoices)",
      "totalRevenue": number (sum of revenue from all invoices)"
      "lastSoldDate": "string (YYYY-MM-DD of last sale, if not available use invoice date)"
      "category": "string (type or category of the product || give unknown if it cannot be determined)"
    }
  ],
  "customers": [
    {
      "id": "string (unique customer identifier, e.g., customer_001)",
      "name": "string (customer name)",
      "company": "string (company name if available)",
      "gstin": "string (GSTIN/Tax ID if available)",
      "phone": "string (phone number if available)",
      "email": "string (email if available)",
      "totalPurchaseAmount": number (sum of all invoice totals)",
      "totalInvoices": number (count of invoices)",
      "status": "string (active, inactive)",
      "validationErrors": ["array of missing field names"],
      "purchaseDate": "string (YYYY-MM-DD of last purchase, if not available use invoice date)"
    }
  ],
  "metadata": {
    "totalInvoices": number,
    "totalProducts": number,
    "totalCustomers": number,
    "totalRevenue": number,
    "totalTax": number,
    "extractionDate": "string (ISO 8601 timestamp)",
    "sourceFile": "string (filename)",
    "validationStatus": "string (complete, partial, failed)",
    "missingFields": ["array of missing critical fields"],
    "warnings": ["array of extraction warnings/notes"]
  }
}w

Rules:
- If the same invoice number appears multiple times, group all items into ONE invoice.
- Normalize product and customer names (case-insensitive, remove duplicates).
- Maintain relationships using consistent IDs.
- Use "" for missing text fields and 0 for missing numeric fields.
- Add missing field names to validationErrors and metadata.missingFields.
- Calculate all prices and taxes accurately:
  taxableValue = quantity × unitPrice
  gstAmount = taxableValue × (taxRate / 100)
  priceWithTax = unitPrice × (1 + taxRate / 100)
  totalAmount = quantity × priceWithTax
- If only total GST is given, split equally into CGST and SGST for intra-state, or assign to IGST for inter-state.
- Determine status using keywords: PAID, PENDING, CANCELLED, DUE (default: pending).
- Dates must be converted to YYYY-MM-DD.
- Ensure all totals match mathematically.
- JSON must be valid and parsable.

Now extract data from the following invoice input:
`,
        });
      }
      const processingTimer = simulateProcessing();

      clearInterval(processingTimer);
      setProgress(100);

      console.log("response received in uploadFile");
      console.log(response);

      const invoices = response.invoices;

      console.log("invoices in uploadFIle**********************************");
      console.log(invoices);

      if (!Array.isArray(invoices)) {
        throw new Error("Invalid API response: invoices is not an array");
      }

      invoices.forEach((inv, index) => {
        inv.invoices.forEach((eachInvoice, index) => {
          dispatch(
            addInvoice({
              ...eachInvoice,
              id: v4(),
            }),
          );
        });

        console.log("customers in invoice");
        console.log(inv.customers);

        if (inv.customers) {
          inv.customers.forEach((customer, cIndex) => {
            dispatch(
              addCustomer({
                ...customer,
                id: v4(),
              }),
            );
          });
        }

        inv.products?.forEach((p, pIndex) => {
          dispatch(
            addProduct({
              ...p,
              id: v4(),
            }),
          );
        });
      });

      setOutput({ data: invoices });
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      console.error(err);
      setError(err + "here in catch" || "Something went wrong");
      dispatch(setInvoiceError(err.message));
      setStatus(STATUS.ERROR);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus(STATUS.IDLE);
    setError("");
    setProgress(0);
    setOutput(null);
  };

  // DebugRedux();

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center transition",
            isDragging ? "border-primary bg-primary/10" : "border-gray-300",
          )}
        >
          <input
            type="file"
            hidden
            id="upload"
            accept="image/*,application/pdf,.xlsx,.xls,.docx,text/plain"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            disabled={status === STATUS.PROCESSING}
          />

          <label htmlFor="upload" className="cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm">
              Click or drag a file (image / PDF / Excel / Word)
            </p>
          </label>
        </motion.div>

        {status !== STATUS.IDLE && status !== STATUS.ERROR && (
          <div className="space-y-2">
            {status !== STATUS.SUCCESS ? <Progress value={progress} /> : null}
            <p className="text-xs flex items-center gap-2 text-muted-foreground">
              {status !== STATUS.SUCCESS ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2Icon className="h-3 w-3 text-green-600" />
              )}

              {status === STATUS.UPLOADING && "Reading file..."}
              {status === STATUS.PROCESSING && "Analyzing with AI..."}
              {status === STATUS.SUCCESS && "Completed"}
            </p>
          </div>
        )}

        {status === STATUS.ERROR && (
          <div className="flex gap-2 text-red-600 bg-red-50 p-3 rounded">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {status === STATUS.SUCCESS && (
          <div className="flex gap-2 text-green-600 bg-green-50 p-3 rounded">
            <CheckCircle2 className="h-4 w-4" />
            Data extracted successfully
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={reset}
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
