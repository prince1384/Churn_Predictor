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

  // Load prediction data from localStorage on mount
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
      // Optionally, fetch a summary or update UI
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
        body: JSON.stringify(predictionData),
      });
      if (!response.ok) throw new Error('Failed to download PDF report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'churn-prediction-report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full min-h-screen bg-gray-900 text-white">
      {/* Main content */}
      <div className="w-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-8 border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <TrendingDownIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Enterprise Churn Analytics
              </h1>
            </div>
            <div className="text-sm text-gray-400">
              <span className="mr-2">•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-200">
              Customer Retention Dashboard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Analyze and predict customer churn patterns with advanced
              analytics
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Left sidebar with actions */}
            <div className="w-full md:w-1/4 space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg">
                <h3 className="text-gray-300 font-medium mb-4">Actions</h3>
                <button onClick={generateReport} disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-200 w-full mb-3">
                  <FileTextIcon className="h-4 w-4" />
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
                {error && (
                  <div className="mb-3 p-2 bg-red-500/20 text-red-300 rounded text-sm">
                    {error}
                  </div>
                )}
                <button onClick={downloadReport} disabled={!reportGenerated} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 w-full ${reportGenerated ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                  <DownloadIcon className="h-4 w-4" />
                  Export Report
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg">
                <h3 className="text-gray-300 font-medium mb-4">
                  Report Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Report ID:</span>
                    <span className="text-gray-300">
                      CHR-{Math.floor(Math.random() * 10000)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Period:</span>
                    <span className="text-gray-300">Q2 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-gray-300">93.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-gray-300">Enterprise ML v2.4</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Report Display (Center) */}
            <div className="w-full md:w-2/4 h-[600px] flex justify-center">
              <div id="report-panel" className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 shadow-xl overflow-hidden flex flex-col">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3Icon className="h-5 w-5 text-blue-400" />
                    <h2 className="text-lg font-medium">
                      Customer Churn Analysis
                    </h2>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Enterprise Report
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-auto">
                  {reportGenerated && reportData ? <div className="w-full space-y-8">
                      {/* Executive Summary and Risk Distribution - dynamic */}
                      {predictionData && (
                        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                          <h3 className="text-lg font-medium text-gray-200">
                            Executive Summary
                          </h3>
                          <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                            Model: {predictionData.model_used || 'N/A'}
                          </span>
                        </div>
                      )}
                      {predictionData && predictionData.records && predictionData.prediction_column && (() => {
                        const total = predictionData.records.length;
                        const dist = (predictionData.records as any[]).reduce((acc: Record<string, number>, rec: any) => {
                          const val = rec[predictionData.prediction_column];
                          acc[val] = (acc[val] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        return (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(dist).map(([risk, count]) => (
                              <div key={risk} className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-gray-400 text-xs uppercase font-medium">{risk}</p>
                                  <div className={`w-3 h-3 rounded-full ${risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                </div>
                                <p className="text-2xl font-bold text-white">{((Number(count) / total) * 100).toFixed(1)}%</p>
                                <p className={`text-xs mt-1 flex items-center ${risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-amber-400' : 'text-green-400'}`}>{count} customers</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-200 flex items-center">
                            <PieChartIcon className="h-4 w-4 mr-2 text-blue-400" />
                            Key Churn Indicators
                          </h3>
                          <span className="text-xs text-gray-400">
                            Weighted Analysis
                          </span>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-gray-300">
                                  Service Usage Decline
                                </span>
                                <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-sm">
                                  70%
                                </span>
                              </div>
                              <div className="w-2/5 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                                <div className="bg-blue-500 h-full rounded-full" style={{
                              width: '70%'
                            }}></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-gray-300">
                                  Pricing Concerns
                                </span>
                                <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded-sm">
                                  85%
                                </span>
                              </div>
                              <div className="w-2/5 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                                <div className="bg-purple-500 h-full rounded-full" style={{
                              width: '85%'
                            }}></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-gray-300">
                                  Support Tickets
                                </span>
                                <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-sm">
                                  45%
                                </span>
                              </div>
                              <div className="w-2/5 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                                <div className="bg-red-500 h-full rounded-full" style={{
                              width: '45%'
                            }}></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-gray-300">
                                  Feature Adoption
                                </span>
                                <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded-sm">
                                  30%
                                </span>
                              </div>
                              <div className="w-2/5 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                                <div className="bg-green-500 h-full rounded-full" style={{
                              width: '30%'
                            }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-medium text-gray-200">
                          Report Content
                        </h3>
                        <div className="bg-gray-800/40 rounded-lg border border-gray-700 p-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-300">
                            {reportData && 'report' in reportData ? reportData.report : ''}
                          </pre>
                        </div>
                      </div>
                    </div> : <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                      <div className="bg-gray-800/40 rounded-full p-4 mb-4">
                        <BarChart3Icon className="h-10 w-10 text-gray-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-400">
                        No report generated
                      </p>
                      <p className="text-sm mt-2 text-gray-500 max-w-sm">
                        Generate a new churn prediction report to view detailed
                        analytics and recommendations
                      </p>
                      <button onClick={generateReport} className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200">
                        Generate Report
                      </button>
                    </div>}
                </div>
              </div>
            </div>
            {/* Right sidebar */}
            <div className="w-full md:w-1/4 space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg">
                <h3 className="text-gray-300 font-medium mb-4">
                  Risk Breakdown
                </h3>
                {reportGenerated ? <div className="space-y-4">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block text-blue-400">
                            Enterprise Customers
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-400">
                            18%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-800 border border-gray-700">
                        <div style={{
                      width: '18%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            Mid-Market
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            42%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-800 border border-gray-700">
                        <div style={{
                      width: '42%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block text-emerald-400">
                            Small Business
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-emerald-400">
                            40%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-800 border border-gray-700">
                        <div style={{
                      width: '40%'
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
                      </div>
                    </div>
                  </div> : <div className="text-center py-6 text-gray-500 text-sm">
                    No data available
                  </div>}
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg">
                <h3 className="text-gray-300 font-medium mb-4">
                  Churn Timeline
                </h3>
                {reportGenerated ? <div className="space-y-3 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-gray-400">Q1 2023</span>
                        <span className="text-gray-300">21.2%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-gray-400">Q2 2023</span>
                        <span className="text-gray-300">24.3%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-600 mr-2"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-gray-400">Q3 2023</span>
                        <span className="text-gray-500">Projected: 23.1%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-600 mr-2"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="text-gray-400">Q4 2023</span>
                        <span className="text-gray-500">Projected: 20.8%</span>
                      </div>
                    </div>
                  </div> : <div className="text-center py-6 text-gray-500 text-sm">
                    No data available
                  </div>}
              </div>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="py-4 px-8 border-t border-gray-800 bg-gray-900/60 backdrop-blur-sm text-center text-gray-500 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p>Enterprise Churn Analytics Platform v2.1</p>
            <p>© 2023 SpaceAnalytics Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>;
};
export default ChurnPredictor;