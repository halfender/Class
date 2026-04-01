import React, { useState, useEffect } from 'react';
import RiskScore from './RiskScore';

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-4 space-y-2 text-sm text-slate-600">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      <span className="font-medium text-slate-500 shrink-0 w-36">{label}:</span>
      <span className="text-slate-700">{value || 'Not specified'}</span>
    </div>
  );
}

function TagList({ items, color = 'red' }) {
  if (!items || items.length === 0) return <p className="text-slate-400 italic text-xs">None identified</p>;
  const colorMap = {
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className={`text-xs px-2.5 py-1.5 rounded-lg border ${colorMap[color]}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Dashboard({ result, file }) {
  const { analysis, fileName } = result;
  const [pdfObjectUrl] = useState(() => file ? URL.createObjectURL(file) : null);
  const [safePdfUrl, setSafePdfUrl] = useState(null);

  useEffect(() => {
    if (!pdfObjectUrl) return;
    // Use URL constructor to parse and reconstruct, ensuring only blob: protocol is accepted
    try {
      const parsed = new URL(pdfObjectUrl);
      if (parsed.protocol === 'blob:') {
        setSafePdfUrl(parsed.href);
      }
    } catch {
      // Invalid URL, do not set
    }
    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
    };
  }, [pdfObjectUrl]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
      {/* Left: PDF Viewer */}
      <div className="flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col" style={{ minHeight: '80vh' }}>
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center space-x-2 shrink-0">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-slate-700 truncate">{fileName}</span>
          </div>
          <div className="flex-1">
            {safePdfUrl ? (
              <iframe
                src={safePdfUrl}
                title="Lease PDF"
                className="w-full h-full"
                style={{ minHeight: '75vh', border: 'none' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>PDF preview not available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Analysis Summary */}
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <div>
          <h2 className="text-xl font-bold text-slate-900">LeaseLens Analysis</h2>
          <p className="text-sm text-slate-500 mt-0.5">AI-powered summary of your lease agreement</p>
        </div>

        {/* Risk Score */}
        <RiskScore score={analysis.riskScore} level={analysis.riskLevel} />

        {/* Red Flags */}
        {analysis.redFlags && analysis.redFlags.length > 0 && (
          <SectionCard title="Red Flags" icon="🚩">
            <TagList items={analysis.redFlags} color="red" />
          </SectionCard>
        )}

        {/* Positive Terms */}
        {analysis.positiveTerms && analysis.positiveTerms.length > 0 && (
          <SectionCard title="Positive Terms" icon="✅">
            <TagList items={analysis.positiveTerms} color="green" />
          </SectionCard>
        )}

        {/* Rent & Payment */}
        <SectionCard title="Rent & Payment" icon="💰">
          <InfoRow label="Monthly Rent" value={analysis.rentAndPayment?.monthlyRent} />
          <InfoRow label="Due Date" value={analysis.rentAndPayment?.dueDate} />
          <InfoRow label="Grace Period" value={analysis.rentAndPayment?.gracePeriod} />
          <InfoRow label="Late Fee" value={analysis.rentAndPayment?.lateFee} />
        </SectionCard>

        {/* Security Deposit */}
        <SectionCard title="Security Deposit" icon="🔐">
          <InfoRow label="Amount" value={analysis.securityDeposit?.amount} />
          <InfoRow label="Return Conditions" value={analysis.securityDeposit?.returnConditions} />
          <InfoRow label="Deduction Policy" value={analysis.securityDeposit?.deductionPolicy} />
        </SectionCard>

        {/* Lease Term */}
        <SectionCard title="Lease Term" icon="📅">
          <InfoRow label="Start Date" value={analysis.leaseTerm?.startDate} />
          <InfoRow label="End Date" value={analysis.leaseTerm?.endDate} />
          <InfoRow label="Renewal Terms" value={analysis.leaseTerm?.renewalTerms} />
        </SectionCard>

        {/* Pet Policy */}
        <SectionCard title="Pet Policy" icon="🐾">
          <InfoRow label="Pets Allowed" value={analysis.petPolicy?.allowed} />
          <InfoRow label="Pet Deposit" value={analysis.petPolicy?.deposit} />
          <InfoRow label="Monthly Fee" value={analysis.petPolicy?.monthlyFee} />
          <InfoRow label="Restrictions" value={analysis.petPolicy?.restrictions} />
        </SectionCard>

        {/* Termination Clauses */}
        <SectionCard title="Termination / Break-Lease" icon="📋">
          <InfoRow label="Early Termination Fee" value={analysis.terminationClauses?.earlyTerminationFee} />
          <InfoRow label="Notice Period" value={analysis.terminationClauses?.noticePeriod} />
          <InfoRow label="Conditions" value={analysis.terminationClauses?.breakLeaseConditions} />
        </SectionCard>

        {/* Maintenance */}
        <SectionCard title="Maintenance Responsibilities" icon="🔧">
          {analysis.maintenanceResponsibilities?.tenantResponsible?.length > 0 && (
            <div>
              <p className="font-medium text-slate-500 text-xs mb-1 uppercase tracking-wide">Tenant Responsible</p>
              <TagList items={analysis.maintenanceResponsibilities.tenantResponsible} color="orange" />
            </div>
          )}
          {analysis.maintenanceResponsibilities?.landlordResponsible?.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-slate-500 text-xs mb-1 uppercase tracking-wide">Landlord Responsible</p>
              <TagList items={analysis.maintenanceResponsibilities.landlordResponsible} color="green" />
            </div>
          )}
        </SectionCard>

        {/* Utilities */}
        <SectionCard title="Utilities" icon="⚡">
          {analysis.utilities?.tenantPays?.length > 0 && (
            <div>
              <p className="font-medium text-slate-500 text-xs mb-1 uppercase tracking-wide">Tenant Pays</p>
              <TagList items={analysis.utilities.tenantPays} color="orange" />
            </div>
          )}
          {analysis.utilities?.landlordPays?.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-slate-500 text-xs mb-1 uppercase tracking-wide">Landlord Pays</p>
              <TagList items={analysis.utilities.landlordPays} color="green" />
            </div>
          )}
        </SectionCard>

        {/* Hidden Fees */}
        <SectionCard title="Hidden Fees & Additional Charges" icon="💸">
          <TagList items={analysis.hiddenFees} color="red" />
        </SectionCard>
      </div>
    </div>
  );
}

export default Dashboard;
