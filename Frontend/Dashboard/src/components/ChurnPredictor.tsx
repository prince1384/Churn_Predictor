import { useState, useEffect } from 'react';
import { DownloadIcon, FileTextIcon, BarChart3Icon, PieChartIcon, TrendingDownIcon } from 'lucide-react';

const ChurnPredictor = () => {
  type PredictionData = {
    records: any[];
    model_used: string;
    file_name: string;
    prediction_column: string;
    [key: string]: any;
  };
  type ReportData = { report: string } | null;
  const [reportGenerated, setReportGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('latestPrediction');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPredictionData(parsed);
        setReportGenerated(true);
      } catch (e) {
        setPredictionData(null);
      }
    }
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      if (!predictionData) throw new Error('No prediction data found. Please run a prediction first.');
      setReportData({ report: 'Report ready. You can now download the PDF.' });
      setReportGenerated(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };
  const downloadReport = async () => {
    if (!reportGenerated || !predictionData) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/report/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ file_name: predictionData.file_name })
      });
      if (!response.ok) throw new Error('Failed to download report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center"><BarChart3Icon className="mr-2" /> Churn Prediction Report</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {predictionData && (
        <div className="mb-4">
          <div className="flex items-center mb-2"><PieChartIcon className="mr-2" /> Model Used: {predictionData.model_used}</div>
          <div className="flex items-center mb-2"><FileTextIcon className="mr-2" /> File: {predictionData.file_name}</div>
          <div className="flex items-center mb-2"><TrendingDownIcon className="mr-2" /> Prediction Column: {predictionData.prediction_column}</div>
        </div>
      )}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
        onClick={generateReport}
        disabled={loading || !predictionData}
      >
        Generate Report
      </button>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={downloadReport}
        disabled={loading || !reportGenerated}
      >
        <DownloadIcon className="inline mr-1" /> Download PDF
      </button>
      {reportData && <div className="mt-4 p-2 bg-gray-100 rounded">{reportData.report}</div>}
    </div>
  );
};

export default ChurnPredictor;
