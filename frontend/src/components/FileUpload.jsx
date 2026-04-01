import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function FileUpload({ onUploadSuccess, onError, onLoadingChange, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file only.');
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      onError('File size must be less than 20MB.');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    onLoadingChange(true);
    try {
      const formData = new FormData();
      formData.append('lease', selectedFile);
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
      });
      onUploadSuccess(response.data, selectedFile);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to analyze lease. Please try again.';
      onError(errorMsg);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current.click()}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
            <p className="text-xs text-slate-400">Click to change file</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700">
                {isDragging ? 'Drop your lease here' : 'Drag & drop your lease PDF'}
              </p>
              <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
            </div>
            <p className="text-xs text-slate-400">PDF files only · Max 20MB</p>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || isLoading}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
          selectedFile && !isLoading
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.99]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Analyzing Lease...</span>
          </span>
        ) : (
          '🔍 Analyze My Lease'
        )}
      </button>
    </div>
  );
}

export default FileUpload;
