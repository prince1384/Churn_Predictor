import React, { useState } from 'react';
import Dashboard from './components/Dashboard.tsx';
import FileUpload from './components/FileUpload.tsx';
export default function DashboardPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [predictionColumn, setPredictionColumn] = useState<string | null>(null);
  const [classDistribution, setClassDistribution] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleDataLoaded = (parsedData: any[]) => {
    setData(parsedData);
  };
  const handleServerPredictions = (serverData: any) => {
    setData(serverData.records || []);
    setPredictionColumn(serverData.prediction_column || null);
    setClassDistribution(serverData.class_distribution || null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(60,60,60,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(60,60,60,0.1),transparent_70%)] pointer-events-none"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-10">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Churn Prediction Dashboard
            </h1>
          </div>
          <p className="text-gray-400 ml-11 border-l-2 border-gray-700 pl-3">
            Upload your CSV data to visualize churn predictions with advanced
            analytics
          </p>
        </header>
        {!data ? (
          <FileUpload onDataLoaded={handleDataLoaded} onServerPredictions={handleServerPredictions} setIsLoading={setIsLoading} />
        ) : (
          <Dashboard data={data} isLoading={isLoading} predictionColumn={predictionColumn} classDistribution={classDistribution} />
        )}
      </div>
    </div>;
}
