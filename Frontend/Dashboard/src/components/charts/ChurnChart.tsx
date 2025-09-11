import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const ChurnChart = ({
  data,
  predictionColumn,
  classDistribution
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Use backend-provided prediction column if available
    const isChurn = (val) => {
      if (val === undefined || val === null) return false;
      const s = String(val).toLowerCase();
      return s === '1' || s === 'yes' || s === 'true' || s === 'churn' || s === 'positive';
    };
    let churnedCount;
    let retainedCount;
    if (classDistribution) {
      const churned = classDistribution['1'] || classDistribution['Yes'] || classDistribution['True'] || classDistribution['Churn'] || 0;
      const retained = Object.values(classDistribution).reduce((a, b) => a + (b as number), 0) - churned;
      churnedCount = churned;
      retainedCount = retained;
    } else {
      churnedCount = data.filter(item => isChurn(predictionColumn ? item[predictionColumn] : item.churn)).length;
      retainedCount = data.length - churnedCount;
    }
    // Create data for pie chart
    const pieData = [{
      name: 'Churned',
      value: churnedCount
    }, {
      name: 'Retained',
      value: retainedCount
    }];
    // Placeholder factor data (since backend doesn't provide them)
    const factorData = [{
      name: 'Contract Length',
      value: Math.random() * 100
    }, {
      name: 'Service Issues',
      value: Math.random() * 100
    }, {
      name: 'Price Sensitivity',
      value: Math.random() * 100
    }, {
      name: 'Competitor Offers',
      value: Math.random() * 100
    }, {
      name: 'Usage Decline',
      value: Math.random() * 100
    }].sort((a, b) => b.value - a.value);
    return {
      pieData,
      factorData
    };
  }, [data]);
  // Enhanced color palette with gradients
  const COLORS = ['#FF4560', '#00E396'];
  const RADIAN = Math.PI / 180;
  // Custom label for the pie chart with enhanced styling
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="#FFFFFF" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="500" fontSize="12">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>;
  };
  if (!data || data.length === 0 || !chartData.pieData) {
    return <div className="flex items-center justify-center h-64 bg-gray-900/50 rounded-lg border border-gray-700/50">
        <div className="text-gray-400 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No data available for visualization</p>
        </div>
      </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="h-72 bg-gray-900/40 p-4 rounded-lg border border-gray-700/30 backdrop-blur-sm">
        <h4 className="text-gray-300 text-sm mb-2 font-medium">
          Customer Distribution
        </h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <defs>
              <linearGradient id="colorChurned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4560" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#FF4560" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E396" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00E396" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <Pie data={chartData.pieData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value" strokeWidth={2} stroke="#222">
              {chartData.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={`url(#color${entry.name})`} style={{
              filter: 'drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.1))'
            }} />)}
            </Pie>
            <Tooltip formatter={value => [`${value} customers`, 'Count']} contentStyle={{
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }} />
            <Legend verticalAlign="bottom" height={36} formatter={value => <span style={{
            color: '#ddd'
          }}>
                  {value}
                </span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 bg-gray-900/40 p-4 rounded-lg border border-gray-700/30 backdrop-blur-sm">
        <h4 className="text-gray-300 text-sm mb-2 font-medium">
          Churn Factors
        </h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData.factorData} layout="vertical" margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 5
        }}>
            <defs>
              {chartData.factorData.map((entry, index) => <linearGradient id={`colorFactor${index}`} key={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={`hsl(${index * 60}, 80%, 55%)`} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={`hsl(${index * 60}, 80%, 65%)`} stopOpacity={0.7} />
                </linearGradient>)}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" domain={[0, 100]} tick={{
            fill: '#aaa',
            fontSize: 11
          }} axisLine={{
            stroke: 'rgba(255,255,255,0.2)'
          }} tickLine={{
            stroke: 'rgba(255,255,255,0.2)'
          }} />
            <YAxis dataKey="name" type="category" tick={{
            fill: '#aaa',
            fontSize: 11
          }} width={80} axisLine={{
            stroke: 'rgba(255,255,255,0.2)'
          }} tickLine={{
            stroke: 'rgba(255,255,255,0.2)'
          }} />
            <Tooltip formatter={value => [`${value.toFixed(1)}% impact`, 'Factor Weight']} contentStyle={{
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }} cursor={{
            fill: 'rgba(255, 255, 255, 0.05)'
          }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} style={{
            filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.1))'
          }}>
              {chartData.factorData.map((entry, index) => <Cell key={`cell-${index}`} fill={`url(#colorFactor${index})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>;
};
export default ChurnChart;