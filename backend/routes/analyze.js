const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const { extractTextFromPDF } = require('../utils/pdfParser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LEASE_ANALYSIS_PROMPT = `You are an expert real estate attorney specializing in tenant rights. Analyze the following apartment lease agreement and provide a detailed, structured summary.

Extract and clearly explain:
1. **Rent & Payment**: Monthly rent amount, due date, grace period, late fees
2. **Security Deposit**: Amount, conditions for return, deduction policies
3. **Lease Term**: Start date, end date, renewal terms
4. **Pet Policy**: Whether pets are allowed, pet deposit, monthly pet fees, restrictions
5. **Termination Clauses**: Early termination fees, required notice period, break-lease conditions
6. **Maintenance Responsibilities**: What tenant is responsible for vs landlord
7. **Utilities**: Which utilities tenant pays vs landlord
8. **Hidden Fees**: Any unusual fees, charges, or financial obligations

Also provide:
- A **Risk Score** from 1-10 (1=very tenant-friendly, 10=very landlord-friendly/risky)
- A **Risk Level**: "low" (1-3), "medium" (4-6), or "high" (7-10)
- A list of **Red Flags**: Specific clauses that are unusually unfavorable to the tenant
- A list of **Positive Terms**: Clauses that are favorable to the tenant

Respond ONLY with valid JSON in this exact format:
{
  "rentAndPayment": { "monthlyRent": "", "dueDate": "", "gracePeriod": "", "lateFee": "" },
  "securityDeposit": { "amount": "", "returnConditions": "", "deductionPolicy": "" },
  "leaseTerm": { "startDate": "", "endDate": "", "renewalTerms": "" },
  "petPolicy": { "allowed": "", "deposit": "", "monthlyFee": "", "restrictions": "" },
  "terminationClauses": { "earlyTerminationFee": "", "noticePeriod": "", "breakLeaseConditions": "" },
  "maintenanceResponsibilities": { "tenantResponsible": [], "landlordResponsible": [] },
  "utilities": { "tenantPays": [], "landlordPays": [] },
  "hiddenFees": [],
  "riskScore": 5,
  "riskLevel": "medium",
  "redFlags": [],
  "positiveTerms": []
}`;

router.post('/analyze', upload.single('lease'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are accepted' });
    }

    const pdfText = await extractTextFromPDF(req.file.buffer);

    if (!pdfText || pdfText.trim().length < 100) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: LEASE_ANALYSIS_PROMPT },
        { role: 'user', content: `Here is the lease agreement text:\n\n${pdfText.substring(0, 12000)}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const analysisText = completion.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    res.json({
      success: true,
      fileName: req.file.originalname,
      pageCount: pdfText.length,
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ error: 'Invalid OpenAI API key. Please check your configuration.' });
    }
    res.status(500).json({ error: 'Failed to analyze lease. Please try again.' });
  }
});

module.exports = router;
