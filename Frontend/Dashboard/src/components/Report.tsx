import React, { useState, useEffect } from 'react';

const Report = () => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/report', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        setReport(data.report);
      } catch (error) {
        console.error('Error fetching report:', error);
        setReport('Failed to load report.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Report Generator</h1>
      <div className="bg-gray-800 p-8 rounded-lg">
        {isLoading ? (
          <p>Generating report...</p>
        ) : (
          <pre className="whitespace-pre-wrap">{report}</pre>
        )}
      </div>
      <button 
        onClick={handleDownload} 
        disabled={isLoading || !report}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Download Report
      </button>
    </div>
  );
};

export default Report;