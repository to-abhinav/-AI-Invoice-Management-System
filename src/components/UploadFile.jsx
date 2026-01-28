"use client";

import { useState } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, CheckCircle2Icon } from "lucide-react";
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

      // 1️⃣ Read file
      const dataUrl = await readAsBase64(selectedFile);

      // 2️⃣ Upload + AI processing
      setStatus(STATUS.PROCESSING);
      const processingTimer = simulateProcessing();

      const response = await postWithProgress("/api/process-file", {
        dataUrl,
        prompt: `Extract invoice information from this document. Extract ALL line items, separating products and charges.
          
          IMPORTANT EXTRACTION RULES:
          1. IGNORE the invoice maker's contact details (phone/email at the top of invoice)
          2. For customer phone number: Look for Mobile, Ph, Contact ONLY in the Consignee/Customer section
          3. For product tax: Calculate as sum of CGST + SGST shown for each product
          4. For total tax: Sum all GST amounts (all CGST + SGST combined)
          5. For priceWithTax: Multiply quantity * unitPrice and add tax amount
          6. All amounts should be numbers without currency symbols
          7. Quantity should be extracted as numbers only
          8. DO NOT MAKE UP OR ASSUME ANY VALUES - if a field is not found, leave it empty

          Return ONLY a valid JSON object with these specific requirements:

          invoice: {
            serialNumber: Invoice/Bill number exactly as shown,
            totalAmount: Final total amount with all taxes and charges,
            quantity: Total items purchased (sum of all product quantities),
            tax: Sum of all GST amounts including all products (all CGST + SGST combined),
            date: Invoice date exactly as shown,
            customerName: Name from Consignee section only,
            productName: Name of the first product only,
            additionalCharges: {
              makingCharges: Amount of making charges (if any),
              debitCardCharges: Amount of debit card charges (if any),
              shippingCharges: Total shipping charges (if any),
              otherCharges: Any other additional charges
            }
          },
          
          products: Array of ONLY actual product items, each containing:
            - name: Full product description
            - quantity: Number of items (numeric only)
            - unitPrice: Base price per item (numeric only)
            - discount: Discount amount (if any, numeric only)
            - tax: GST per product (CGST + SGST, numeric only)
            - priceWithTax: (quantity * unitPrice) - discount + tax
          
          customer: {
            name: Name from Consignee section only,
            phoneNumber: Phone number from Consignee section only (if not found, leave empty),
            totalPurchaseAmount: Same as invoice.totalAmount
          }

          Example structure (with placeholder values):
          {
            "invoice": {
              "serialNumber": "[INVOICE_NUMBER]",
              "customerName": "[CONSIGNEE_NAME]",
              "productName": "[FIRST_PRODUCT_NAME]",
              "totalAmount": "0.00",
              "tax": "0.00",
              "date": "[DATE]",
              "additionalCharges": {
                "makingCharges": "0.00",
                "debitCardCharges": "0.00",
                "shippingCharges": "0.00",
                "otherCharges": "0.00"
              }
            },
            "products": [
              {
                "name": "[PRODUCT_NAME]",
                "quantity": "0",
                "unitPrice": "0.00",
                "discount": "0.00",
                "tax": "0.00",
                "priceWithTax": "0.00"
              }
            ],
            "customer": {
              "name": "[CONSIGNEE_NAME]",
              "phoneNumber": "[CONSIGNEE_PHONE_NUMBER]",
              "totalPurchaseAmount": "0.00"
            }
          }`,
      });

      clearInterval(processingTimer);
      setProgress(100);

      // 3️⃣ Store + Output
      const invoices = response.invoices;

      if (!Array.isArray(invoices)) {
        throw new Error("Invalid API response: invoices is not an array");
      }

      invoices.forEach((inv, index) => {
        dispatch(
          addInvoice({
            ...inv.invoice,
            id: v4(),
          }),
        );

        if (inv.customer) {
          dispatch(
            addCustomer({
              ...inv.customer,
              id: v4(),
            }),
          );
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
      setError(err.message + "here in catch" || "Something went wrong");
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

  DebugRedux();

  /* =========================
     UI
  ========================== */
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        {/* UPLOAD BOX */}
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

        {/* PROGRESS */}
        {status !== STATUS.IDLE && status !== STATUS.ERROR && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs flex items-center gap-2 text-muted-foreground">
              {status !== STATUS.SUCCESS ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2Icon className="h-3 w-3 text-green-600" />}

              {status === STATUS.UPLOADING && "Reading file..."}
              {status === STATUS.PROCESSING && "Analyzing with AI..."}
              {status === STATUS.SUCCESS && "Completed"}
            </p>
          </div>
        )}

        {/* STATUS */}
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

        {/* =========================
            OUTPUT SECTION
        ========================== */
        }

        {output?.data && Array.isArray(output.data) && (
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-lg font-semibold">Extracted Output</h2>

            {output.data
              .filter((item) => item.invoice?.serialNumber !== "Totals")
              .map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  {/* INVOICE */}
                  <section>
                    <h3 className="font-medium mb-1">
                      Invoice #{item.invoice?.serialNumber || index + 1}
                    </h3>
                    <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(item.invoice, null, 2)}
                    </pre>
                  </section>

                  {/* CUSTOMER */}
                  {item.customer && (
                    <section>
                      <h3 className="font-medium mb-1">Customer</h3>
                      <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(item.customer, null, 2)}
                      </pre>
                    </section>
                  )}

                  {/* PRODUCTS */}
                  {Array.isArray(item.products) && item.products.length > 0 && (
                    <section>
                      <h3 className="font-medium mb-1">Products</h3>
                      <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(item.products, null, 2)}
                      </pre>
                    </section>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
