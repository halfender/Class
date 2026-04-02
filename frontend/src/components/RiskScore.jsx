import React from 'react';

function RiskScore({ score, level }) {
  const getColor = () => {
    if (level === 'low') return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', fill: 'bg-green-500', label: 'Low Risk', emoji: '✅' };
    if (level === 'high') return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', fill: 'bg-red-500', label: 'High Risk', emoji: '🚨' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', fill: 'bg-yellow-500', label: 'Medium Risk', emoji: '⚠️' };
  };

  const colors = getColor();
  const percentage = (score / 10) * 100;

  return (
    <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tenant Risk Score</p>
          <p className={`text-2xl font-bold ${colors.text} mt-0.5`}>
            {colors.emoji} {colors.label}
          </p>
        </div>
        <div className={`text-4xl font-black ${colors.text}`}>
          {score}<span className="text-lg font-normal">/10</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${colors.fill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-green-600 font-medium">Tenant-Friendly</span>
        <span className="text-xs text-red-600 font-medium">Landlord-Favorable</span>
      </div>
    </div>
  );
}

export default RiskScore;
