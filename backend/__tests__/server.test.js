const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../server');

const SAMPLE_LEASE_PATH = path.resolve(__dirname, '../../frontend/public/sample-lease.pdf');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/analyze', () => {
  it('returns 400 when no file is uploaded', async () => {
    const res = await request(app).post('/api/analyze');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no pdf file/i);
  });

  it('returns 400 when a non-PDF file is uploaded', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .attach('lease', Buffer.from('not a pdf'), { filename: 'lease.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only pdf/i);
  });

  it('returns 400 when an unreadable (too short) PDF is uploaded', async () => {
    // Minimal PDF bytes that pass mime check but contain no extractable text
    const emptyPdf = Buffer.from('%PDF-1.4\n%%EOF\n');
    const res = await request(app)
      .post('/api/analyze')
      .attach('lease', emptyPdf, { filename: 'empty.pdf', contentType: 'application/pdf' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/could not extract text/i);
  });

  it('analyzes the sample lease PDF and returns structured results', async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('Skipping OpenAI test: OPENAI_API_KEY not set');
      return;
    }

    const res = await request(app)
      .post('/api/analyze')
      .attach('lease', fs.readFileSync(SAMPLE_LEASE_PATH), {
        filename: 'sample-lease.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fileName).toBe('sample-lease.pdf');
    expect(typeof res.body.pageCount).toBe('number');

    const { analysis } = res.body;
    expect(analysis).toHaveProperty('rentAndPayment');
    expect(analysis).toHaveProperty('securityDeposit');
    expect(analysis).toHaveProperty('leaseTerm');
    expect(analysis).toHaveProperty('petPolicy');
    expect(analysis).toHaveProperty('terminationClauses');
    expect(analysis).toHaveProperty('maintenanceResponsibilities');
    expect(analysis).toHaveProperty('utilities');
    expect(analysis).toHaveProperty('hiddenFees');
    expect(typeof analysis.riskScore).toBe('number');
    expect(['low', 'medium', 'high']).toContain(analysis.riskLevel);
    expect(Array.isArray(analysis.redFlags)).toBe(true);
    expect(Array.isArray(analysis.positiveTerms)).toBe(true);
  }, 60000);
});
