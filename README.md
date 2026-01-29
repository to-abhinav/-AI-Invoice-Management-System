# 📄 Automated Invoice Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-orange)

An intelligent, AI-powered invoice processing system that automatically extracts, validates, normalizes, and manages invoice data from multiple file formats including Excel, PDF, images, and documents.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [How It Works](#-how-it-works)
- [Supported File Types](#-supported-file-types)
- [API Documentation](#-api-documentation)
- [State Management](#-state-management)
- [Validation & Error Handling](#-validation--error-handling)
- [UI Components](#-ui-components)
- [Known Limitations](#-known-limitations)
- [Future Roadmap](#-future-roadmap)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

The **Automated Invoice Management System** is a cutting-edge solution designed to revolutionize invoice processing by eliminating manual data entry. Built with Next.js and powered by Google Gemini AI, this system intelligently extracts structured data from unstructured invoice documents across multiple formats.

### Why This System?

- **⏱️ Save Time**: Reduce invoice processing time from minutes to seconds
- **🎯 Increase Accuracy**: AI-powered extraction minimizes human errors
- **📊 Structured Data**: Automatically normalize and validate invoice information
- **🔄 Seamless Integration**: Redux-based state management for real-time updates
- **🚀 Scalable**: Built on Next.js for production-ready performance

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Multi-format Support**: Process invoices from Excel, PDF, images (JPG, PNG), Word documents, and text files
- **Smart Extraction**: Google Gemini AI automatically identifies and extracts invoice fields
- **Intelligent Normalization**: Converts varied data formats into standardized structures
- **Context-Aware Processing**: Handles different invoice layouts and formats

### 📁 File Processing
- **Universal File Upload**: Supports Excel (.xls, .xlsx), PDF, images (.jpg, .png, .jpeg), Word documents (.doc, .docx), and text files (.txt)
- **File Signature Validation**: Deep validation to prevent corrupted or malicious files
- **Base64 Encoding**: Secure file handling and transmission
- **Large File Support**: Efficient processing of multi-page invoices

### 🔐 Data Validation & Security
- **Schema Validation**: Strict Zod-based validation ensures data integrity
- **Sanitization Pipeline**: Multi-layer data cleaning and normalization
- **Error Recovery**: Graceful handling of invalid or incomplete data
- **Type Safety**: End-to-end TypeScript-ready schema definitions

### 🎨 Modern User Interface
- **Multi-Tab Dashboard**: Organized views for Invoices, Customers, and Products
- **Real-time Updates**: Redux-powered reactive UI
- **Responsive Design**: Built with Tailwind CSS for all screen sizes
- **Accessible Components**: Shadcn UI for polished, accessible components

### 📊 Data Management
- **Centralized Store**: Redux Toolkit for predictable state management
- **Normalized Data**: Separate slices for invoices, customers, and products
- **Relationship Mapping**: Automatic linking between invoices, customers, and items
- **Export Ready**: Structured data ready for database persistence or export

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI component library |
| **Redux Toolkit** | State management |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn UI** | Pre-built accessible components |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **Google Gemini AI** | AI-powered invoice extraction |
| **XLSX** | Excel file parsing |
| **PDF-Parse** | PDF text extraction |
| **Zod** | Schema validation |

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   File Upload   │
│  (Any Format)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ File Validation │
│   & Signature   │
│    Checking     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Format Parser  │
│ (Excel/PDF/Img) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Google Gemini  │
│   AI Extraction │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanitization   │
│  & Normalization│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Zod Validation  │
│    (Schema)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redux Store    │
│   (Invoices,    │
│  Customers,     │
│   Products)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   UI Update     │
│  (Multi-Tab)    │
└─────────────────┘
```

---

## 📂 Project Structure

```
automated-invoice-management-system/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── process-excel/
│   │   │   │   └── route.js          # Excel-specific processing
│   │   │   ├── process-file/
│   │   │   │   └── route.js          # Universal file handler
│   │   │   └── process-pdf/
│   │   │       └── route.js          # PDF processing endpoint
│   │   │
│   │   ├── layout.js                 # Root layout with providers
│   │   ├── page.js                   # Main dashboard page
│   │   └── provider.js               # Redux provider wrapper
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn UI components
│   │   ├── UploadFile.jsx            # File upload component
│   │   ├── InvoicesTab.jsx           # Invoice list view
│   │   ├── CustomersTab.jsx          # Customer list view
│   │   ├── ProductsTab.jsx           # Product list view
│   │   └── TableSection.jsx          # Reusable table component
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── geminiClient.js       # Gemini API client
│   │   │   ├── excelToJsonStrict.js  # Excel → JSON converter
│   │   │   ├── pdfToJson.js          # PDF → JSON converter
│   │   │   ├── imageToJson.js        # Image → JSON converter
│   │   │   ├── processInvoice.js     # Main processing logic
│   │   │   └── sanitizeInvoice.js    # Data sanitization
│   │   │
│   │   ├── schema/
│   │   │   └── invoiceSchema.js      # Zod validation schemas
│   │   │
│   │   ├── utils/
│   │   │   ├── fileValidator.js      # File signature validation
│   │   │   └── formatters.js         # Data formatting utilities
│   │   │
│   │   └── store.js                  # Redux store configuration
│   │
│   └── store/
│       └── slices/
│           ├── invoiceSlice.js       # Invoice state management
│           ├── customerSlice.js      # Customer state management
│           └── productsSlice.js      # Product state management
│
├── public/                           # Static assets
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Environment template
├── .gitignore
├── next.config.js                    # Next.js configuration
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Google Account** - For Gemini API access

### Step 1: Clone the Repository

```bash
git clone https://github.com/to-abhinav/-AI-Invoice-Management-System.git
cd AI-Invoice-Management-System
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

---

## 🔑 Environment Configuration

### Step 1: Create Environment File

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

### Step 2: Add API Keys

Add the following to your `.env.local`:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: API Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB in bytes
NEXT_PUBLIC_ALLOWED_FILE_TYPES=xlsx,xls,pdf,jpg,png,jpeg,doc,docx,txt
```

### Step 3: Get Your Gemini API Key

1. **Visit Google AI Studio**: [https://aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)
2. **Sign in** with your Google account
3. **Create API Key**:
   - Click "Create API Key" button
   - Select "Create API key in new project" or choose an existing project
   - Copy the generated API key
4. **Add to .env.local**:
   ```env
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Important Security Notes

⚠️ **Never commit `.env.local` to version control**

✅ Add `.env.local` to `.gitignore` (already included)

✅ Use `.env.example` as a template for team members

✅ Restart the development server after adding environment variables

---

## 🎮 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:3000
```

### Production Build

Build and run the optimized production version:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

---

## 🔄 How It Works

### Complete Processing Pipeline

#### 1️⃣ **File Upload**
```javascript
// User uploads file through UploadFile component
<UploadFile onFileSelect={handleFileUpload} />
```

#### 2️⃣ **File Validation**
- **Signature Check**: Validates file magic numbers (hex signature)
- **Size Verification**: Ensures file is within limits
- **Type Detection**: Confirms file type matches extension

#### 3️⃣ **Format-Specific Parsing**

**Excel Files:**
```javascript
import * as XLSX from 'xlsx';
const workbook = XLSX.read(buffer);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);
```

**PDF Files:**
```javascript
import pdfParse from 'pdf-parse';
const pdfData = await pdfParse(buffer);
const extractedText = pdfData.text;
```

**Image Files:**
```javascript
// Converted to base64 and sent to Gemini Vision API
const base64Image = buffer.toString('base64');
```

#### 4️⃣ **AI Extraction**
```javascript
// Google Gemini processes the data
const result = await geminiClient.generateContent({
  contents: [{ parts: [{ text: prompt }] }]
});

// Returns structured JSON
{
  "invoiceNumber": "INV-2024-001",
  "date": "2024-01-15",
  "customer": { ... },
  "items": [ ... ]
}
```

#### 5️⃣ **Data Sanitization**
```javascript
// Clean and normalize data
const sanitized = {
  invoiceNumber: invoice.invoiceNumber?.trim() || '',
  date: normalizeDate(invoice.date),
  totalAmount: parseFloat(invoice.totalAmount) || 0,
  // ... more fields
};
```

#### 6️⃣ **Schema Validation**
```javascript
import { invoiceSchema } from '@/lib/schema/invoiceSchema';

// Validate with Zod
const validated = invoiceSchema.parse(sanitizedData);
```

#### 7️⃣ **Redux State Update**
```javascript
// Dispatch to appropriate slice
dispatch(addInvoice(validated));
dispatch(addCustomer(validated.customer));
dispatch(addProducts(validated.items));
```

#### 8️⃣ **UI Update**
React components automatically re-render with new data from Redux store.

---

## 📑 Supported File Types

### ✅ Fully Supported Formats

| Format | Extensions | Notes |
|--------|-----------|-------|
| **Excel** | `.xls`, `.xlsx` | Native support with XLSX library |
| **PDF** | `.pdf` | Text extraction with PDF-Parse |
| **Images** | `.jpg`, `.jpeg`, `.png` | OCR via Gemini Vision API |
| **Word** | `.doc`, `.docx` | Text extraction with Mammoth |
| **Text** | `.txt` | Direct text processing |

### 🔍 File Validation Features

- **Magic Number Verification**: Checks file signature bytes
- **Extension Matching**: Ensures extension matches actual file type
- **Size Limits**: Configurable maximum file size (default 10MB)
- **Corruption Detection**: Identifies corrupted or invalid files
- **Security Scanning**: Prevents malicious file uploads

### ❌ Rejected Files

The system will reject:
- Corrupted or damaged files
- Files renamed with incorrect extensions
- Files exceeding size limits
- Unsupported file formats
- Files with mismatched signatures

---

## 📡 API Documentation

### POST `/api/process-file`

Universal file processing endpoint for all file types.

**Request:**
```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/process-file', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "invoiceNumber": "INV-2024-001",
      "date": "2024-01-15T00:00:00.000Z",
      "dueDate": "2024-02-15T00:00:00.000Z",
      "totalAmount": 1250.50,
      "currency": "USD",
      "status": "pending"
    },
    "customer": {
      "id": "cust_001",
      "name": "Acme Corporation",
      "email": "billing@acme.com",
      "phone": "+1-555-0123",
      "address": "123 Business St, City, State 12345"
    },
    "items": [
      {
        "id": "item_001",
        "description": "Web Development Services",
        "quantity": 40,
        "unitPrice": 25.00,
        "totalPrice": 1000.00
      },
      {
        "id": "item_002",
        "description": "Hosting (Monthly)",
        "quantity": 1,
        "unitPrice": 250.50,
        "totalPrice": 250.50
      }
    ]
  },
  "metadata": {
    "fileType": "application/pdf",
    "fileName": "invoice_jan_2024.pdf",
    "processedAt": "2024-01-29T10:30:00.000Z",
    "processingTime": "2.3s"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid file format",
  "code": "INVALID_FILE_TYPE",
  "details": "Only Excel, PDF, images, Word, and text files are supported"
}
```

### POST `/api/process-excel`

Specialized endpoint for Excel file processing.

**Request & Response:** Same format as `/api/process-file`

---

## 🗄️ State Management

### Redux Store Structure

```javascript
{
  invoices: {
    items: [
      {
        id: '001',
        invoiceNumber: 'INV-2024-001',
        customerId: 'cust_001',
        date: '2024-01-15',
        totalAmount: 1250.50,
        items: ['item_001', 'item_002']
      }
    ],
    loading: false,
    error: null
  },
  customers: {
    items: [
      {
        id: 'cust_001',
        name: 'Acme Corporation',
        email: 'billing@acme.com',
        invoices: ['001']
      }
    ]
  },
  products: {
    items: [
      {
        id: 'item_001',
        description: 'Web Development Services',
        unitPrice: 25.00
      }
    ]
  }
}
```

### Available Actions

**Invoice Slice:**
```javascript
import { addInvoice, updateInvoice, deleteInvoice } from '@/store/slices/invoiceSlice';

// Add new invoice
dispatch(addInvoice(invoiceData));

// Update existing
dispatch(updateInvoice({ id: '001', changes: { status: 'paid' } }));

// Delete invoice
dispatch(deleteInvoice('001'));
```

**Customer Slice:**
```javascript
import { addCustomer, updateCustomer } from '@/store/slices/customerSlice';
```

**Product Slice:**
```javascript
import { addProducts, updateProduct } from '@/store/slices/productsSlice';
```

---

## ✅ Validation & Error Handling

### Schema Validation (Zod)

```javascript
import { z } from 'zod';

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().datetime("Invalid date format"),
  totalAmount: z.number().positive("Amount must be positive"),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    address: z.string().optional()
  }),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive()
  })).min(1, "At least one item is required")
});
```

### Error Handling Levels

1. **File Level**: Validates file signature and size
2. **Parsing Level**: Handles corrupt or malformed data
3. **AI Level**: Manages API failures and timeouts
4. **Schema Level**: Validates data structure and types
5. **UI Level**: Displays user-friendly error messages

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `INVALID_FILE_TYPE` | Wrong file format | Upload supported file type |
| `FILE_TOO_LARGE` | Exceeds size limit | Compress or split file |
| `AI_EXTRACTION_FAILED` | Gemini API error | Check API key and quota |
| `VALIDATION_ERROR` | Invalid data structure | Check invoice format |
| `NETWORK_ERROR` | Connection issue | Check internet connection |

---

## 🎨 UI Components

### UploadFile Component

Drag-and-drop file upload with validation:

```jsx
<UploadFile 
  onFileSelect={handleFile}
  acceptedTypes={['xlsx', 'xls', 'pdf', 'jpg', 'png']}
  maxSize={10485760}
/>
```

### InvoicesTab Component

Displays all processed invoices in a table:

```jsx
<InvoicesTab 
  invoices={invoices}
  onSelect={handleSelectInvoice}
  onDelete={handleDeleteInvoice}
/>
```

### TableSection Component

Reusable table with sorting and filtering:

```jsx
<TableSection 
  data={data}
  columns={columns}
  sortable={true}
  filterable={true}
/>
```

---

## ⚠️ Known Limitations

### Current Constraints

1. **Invoice Format Dependency**
   - Best results with standard invoice layouts
   - Custom or highly irregular formats may require manual review

2. **Processing Time**
   - Large files (5MB+) may take 5-15 seconds
   - Multiple concurrent uploads may be queued

3. **API Quotas**
   - Google Gemini free tier: 60 requests/minute
   - Consider upgrading for high-volume usage

4. **No Persistence**
   - Data stored in Redux (memory only)
   - Refresh clears all data
   - Database integration recommended for production

5. **Single User**
   - No authentication or multi-user support
   - All users share the same session

### Performance Considerations

- **Recommended File Size**: Under 5MB for optimal speed
- **Concurrent Uploads**: Limited to 3 simultaneous uploads
- **Browser Compatibility**: Modern browsers only (Chrome, Firefox, Safari, Edge)

---

## 🚀 Future Roadmap

### Phase 1: Data Persistence (Q2 2024)
- [ ] MongoDB integration for invoice storage
- [ ] PostgreSQL support for relational data
- [ ] Automatic backup and recovery
- [ ] Data migration tools

### Phase 2: Authentication & Security (Q3 2024)
- [ ] User authentication (NextAuth.js)
- [ ] Role-based access control (RBAC)
- [ ] API key management
- [ ] Audit logging
- [ ] Two-factor authentication (2FA)

### Phase 3: Advanced Features (Q4 2024)
- [ ] Batch processing (multiple files)
- [ ] Invoice templates
- [ ] Custom field mapping
- [ ] Duplicate detection
- [ ] Email notifications
- [ ] Webhook integrations

### Phase 4: Export & Reporting (Q1 2025)
- [ ] PDF invoice generation
- [ ] CSV/Excel export
- [ ] Financial reports
- [ ] Analytics dashboard
- [ ] Data visualization (charts/graphs)

### Phase 5: AI Enhancements (Q2 2025)
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Smart categorization
- [ ] Anomaly detection
- [ ] Predictive analytics

### Phase 6: Integration & API (Q3 2025)
- [ ] QuickBooks integration
- [ ] Xero integration
- [ ] Public REST API
- [ ] Zapier integration
- [ ] Slack notifications

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Gemini API Key Not Working

**Problem:** "Invalid API key" error

**Solutions:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify API key format (should start with AIzaSy)
cat .env.local | grep GEMINI_API_KEY

# Restart dev server
npm run dev
```

#### 2. File Upload Fails

**Problem:** File rejected during upload

**Solutions:**
- Verify file is not corrupted
- Check file size (must be under 10MB)
- Ensure file extension matches actual type
- Try converting to supported format

#### 3. Excel Parsing Errors

**Problem:** "Failed to parse Excel" error

**Solutions:**
```bash
# Reinstall XLSX library
npm uninstall xlsx
npm install xlsx@latest

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 4. Redux State Not Updating

**Problem:** UI doesn't reflect new data

**Solutions:**
```javascript
// Check Redux DevTools
// Verify action is dispatched
console.log(store.getState());

// Clear browser cache
// Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

#### 5. Build Errors

**Problem:** Production build fails

**Solutions:**
```bash
# Clear all caches
rm -rf .next node_modules
npm install
npm run build

# Check for type errors
npm run lint
```

### Debug Mode

Enable verbose logging:

```env
# Add to .env.local
NEXT_PUBLIC_DEBUG_MODE=true
NODE_ENV=development
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
```bash
git clone https://github.com/to-abhinav/-AI-Invoice-Management-System.git
```

2. **Create a Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Your Changes**
- Follow existing code style
- Add tests for new features
- Update documentation

4. **Commit Your Changes**
```bash
git commit -m "feat: add amazing feature"
```

5. **Push to Your Fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
- Describe your changes
- Reference any related issues
- Wait for review

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Code Style Guidelines

- Use ESLint and Prettier configurations
- Write descriptive variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow React best practices

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Harry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Abhinav Kumar**

- 📧 Email: abhinavtomar01@gmail.com
- <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="16" /> GitHub: [to-abhinav](https://github.com/to-abhinav)

- <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="16" /> LinkedIn: [Linkedin ](https://www.linkedin.com/in/to-abhinav)


---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI capabilities
- **Next.js Team** - For the amazing framework
- **Redux Team** - For state management tools
- **Shadcn** - For beautiful UI components
- **Open Source Community** - For continuous inspiration

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/to-abhinav/-AI-Invoice-Management-System?style=social)
![GitHub Forks](https://img.shields.io/github/forks/to-abhinav/-AI-Invoice-Management-System?style=social)
![GitHub Issues](https://img.shields.io/github/issues/to-abhinav/-AI-Invoice-Management-System)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/to-abhinav/-AI-Invoice-Management-System)



---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

Made with ❤️ by Abhinav

</div>
