import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { UploadIcon } from 'lucide-react';
const FileUpload = ({
  onDataLoaded,
  onServerPredictions,
  setIsLoading
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const handleDragEnter = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const processFile = useCallback(async file => {
    setFileName(file.name);
    setError('');
    // First: send to backend for predictions
    try {
      setIsLoading && setIsLoading(true);
      const form = new FormData();
      form.append('file', file);
      const token = localStorage.getItem('token');
      const resp = await fetch('http://127.0.0.1:8000/csv', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: form,
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || 'Prediction request failed');
      }
      const serverData = await resp.json();
      onServerPredictions && onServerPredictions(serverData);
    } catch (e: any) {
      setError(e.message || 'Error uploading to server');
    } finally {
      setIsLoading && setIsLoading(false);
    }
    // Also parse locally to show immediate preview if needed
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        if (results.data && results.data.length > 0) {
          onDataLoaded && onDataLoaded(results.data);
        }
      }
    });
  }, [onDataLoaded]);
  const handleDrop = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [processFile]);
  const handleFileChange = useCallback(e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [processFile]);
  return <div className="flex flex-col items-center justify-center">
      <motion.div className={`w-full max-w-2xl p-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative backdrop-blur-sm overflow-hidden ${isDragging ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'bg-gradient-to-br from-gray-800/80 to-gray-900 border border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} whileHover={{
      scale: 1.01,
      boxShadow: '0 0 30px rgba(255,255,255,0.07)'
    }} onClick={() => document.getElementById('file-upload').click()}>
        {/* Background pattern */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-2 opacity-5 pointer-events-none">
          {Array(100).fill(0).map((_, i) => <div key={i} className="bg-white rounded-full"></div>)}
        </div>
        <div className="relative z-10">
          <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
          <motion.div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6" animate={{
          y: isDragging ? [0, -10, 0] : 0
        }} transition={{
          repeat: isDragging ? Infinity : 0,
          duration: 1.5
        }}>
            <UploadIcon size={40} className="text-white" />
          </motion.div>
          <p className="text-2xl font-medium mb-3 text-center">
            {isDragging ? 'Drop CSV file here' : 'Drag & Drop your CSV file here'}
          </p>
          <p className="text-gray-400 mb-6 text-center">or click to browse</p>
          {fileName && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex items-center justify-center px-4 py-2 bg-green-500/20 text-green-300 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{fileName}</span>
            </motion.div>}
          {error && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex items-center justify-center px-4 py-2 bg-red-500/20 text-red-300 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </motion.div>}
        </div>
      </motion.div>
      <div className="mt-10 text-center max-w-lg">
        <h3 className="text-xl font-medium mb-4 text-gray-200">
          CSV Format Requirements
        </h3>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 backdrop-blur-sm">
          <p className="text-gray-300 mb-3">
            Your CSV should include the following columns:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/70 p-3 rounded border border-gray-700/30">
              <span className="text-blue-400 font-medium block mb-1">
                Customer ID
              </span>
              <span className="text-gray-400 text-sm">
                Unique identifier for each customer
              </span>
            </div>
            <div className="bg-gray-900/70 p-3 rounded border border-gray-700/30">
              <span className="text-blue-400 font-medium block mb-1">
                Usage Metrics
              </span>
              <span className="text-gray-400 text-sm">
                Product usage statistics
              </span>
            </div>
            <div className="bg-gray-900/70 p-3 rounded border border-gray-700/30">
              <span className="text-blue-400 font-medium block mb-1">
                Engagement Data
              </span>
              <span className="text-gray-400 text-sm">
                Interaction frequency metrics
              </span>
            </div>
            <div className="bg-gray-900/70 p-3 rounded border border-gray-700/30">
              <span className="text-blue-400 font-medium block mb-1">
                Churn Status
              </span>
              <span className="text-gray-400 text-sm">
                Yes/No or 1/0 indicator
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default FileUpload;