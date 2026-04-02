import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (result, file) => {
    setAnalysisResult(result);
    setUploadedFile(file);
    setError(null);
    setIsLoading(false);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">LeaseLens</h1>
                <p className="text-xs text-slate-500">AI-Powered Lease Analysis</p>
              </div>
            </div>
            {analysisResult && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ← Analyze Another Lease
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Understand Your Lease Before You Sign
              </h2>
              <p className="text-lg text-slate-600">
                Upload your apartment lease PDF and get an instant AI-powered analysis of key terms, hidden fees, and potential red flags.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['Rent & Fees', 'Security Deposit', 'Pet Policy', 'Break-Lease Terms', 'Risk Score'].map((feature) => (
                <span key={feature} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                  {feature}
                </span>
              ))}
            </div>

            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onError={handleError}
              onLoadingChange={setIsLoading}
              isLoading={isLoading}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}
          </div>
        ) : (
          <Dashboard result={analysisResult} file={uploadedFile} />
        )}
      </main>
    </div>
  );
}

export default App;
