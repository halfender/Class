# LeaseLens 🔍

An AI-powered web application that analyzes apartment lease PDFs and provides a simplified summary of key terms, hidden fees, and legal red flags.

## Features

- **Drag-and-Drop Upload**: Easy PDF file upload with a clean UI
- **AI Analysis**: GPT-4o powered analysis of lease terms
- **Key Term Extraction**: Rent, security deposit, pet policy, termination clauses, and more
- **Risk Score**: Visual Green/Yellow/Red indicator of how tenant-friendly the lease is
- **Red Flag Detection**: Highlights unfavorable clauses
- **Side-by-Side Dashboard**: View the original PDF alongside the simplified summary

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4o
- **PDF Processing**: pdf-parse

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs on http://localhost:3000 and the backend on http://localhost:3001.

## Usage

1. Open http://localhost:3000
2. Drag and drop your lease PDF (or click to browse)
3. Click "Analyze My Lease"
4. Review the AI-generated summary and risk score