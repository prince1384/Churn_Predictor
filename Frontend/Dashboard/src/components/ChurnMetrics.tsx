import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
const ChurnMetrics = ({
  data
}) => {
  const predictionData = useMemo(() => {
    if (!data || data.length === 0) return [];
    // This is a simplified example - in a real app, you'd use actual prediction data
    // Here we're just generating mock prediction trends
    // Generate time series prediction data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentChurnRate = data.filter(customer => customer.churn === 'Yes' || customer.churn === '1' || customer.churn === 'True').length / data.length * 100;
    // Create forecast with random variations
    return months.map((month, index) => {
      const predicted = Math.max(0, currentChurnRate + (Math.random() - 0.5) * 5);
      const intervention = Math.max(0, predicted - index * 0.8);
      return {
        name: month,
        predicted: predicted.toFixed(1),
        withIntervention: intervention.toFixed(1)
      };
    });
  }, [data]);
  // Group customers into risk segments
  const riskSegments = useMemo(() => {
    if (!data || data.length === 0) return [];
    // In a real app, this would use your model's probability scores
    // Here we're just creating mock segments
    const segments = [{
      name: 'High Risk (>70%)',
      count: 0,
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
    }, {
      name: 'Medium Risk (30-70%)',
      count: 0,
      color: 'from-yellow-500/20 to-amber-600/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
    }, {
      name: 'Low Risk (<30%)',
      count: 0,
      color: 'from-green-500/20 to-emerald-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
    }];
    data.forEach(customer => {
      const riskScore = parseFloat(customer.churn_probability || Math.random());
      if (riskScore > 0.7) segments[0].count++;else if (riskScore > 0.3) segments[1].count++;else segments[2].count++;
    });
    return segments;
  }, [data]);
  return <div className="space-y-8">
      <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-5">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
              <path d="M3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
          Churn Forecast
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4560" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4560" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIntervention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E396" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E396" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{
              fill: '#aaa'
            }} axisLine={{
              stroke: 'rgba(255,255,255,0.2)'
            }} tickLine={{
              stroke: 'rgba(255,255,255,0.2)'
            }} />
              <YAxis tick={{
              fill: '#aaa'
            }} axisLine={{
              stroke: 'rgba(255,255,255,0.2)'
            }} tickLine={{
              stroke: 'rgba(255,255,255,0.2)'
            }} />
              <Tooltip contentStyle={{
              backgroundColor: 'rgba(30, 30, 30, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }} />
              <Legend verticalAlign="top" height={36} formatter={value => <span style={{
              color: '#ddd'
            }}>
                    {value}
                  </span>} />
              <Area type="monotone" dataKey="predicted" name="Predicted Churn %" stroke="#FF4560" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" dot={{
              r: 4,
              fill: '#FF4560',
              strokeWidth: 1,
              stroke: '#fff'
            }} activeDot={{
              r: 6,
              stroke: '#fff',
              strokeWidth: 1
            }} />
              <Area type="monotone" dataKey="withIntervention" name="With Intervention %" stroke="#00E396" strokeWidth={2} fillOpacity={1} fill="url(#colorIntervention)" dot={{
              r: 4,
              fill: '#00E396',
              strokeWidth: 1,
              stroke: '#fff'
            }} activeDot={{
              r: 6,
              stroke: '#fff',
              strokeWidth: 1
            }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-5">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          Risk Segments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskSegments.map((segment, index) => <motion.div key={index} className={`bg-gradient-to-br ${segment.color} backdrop-blur-sm rounded-lg p-5 border ${segment.borderColor} relative overflow-hidden`} whileHover={{
          scale: 1.03,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }}>
              <div className="absolute right-0 bottom-0 opacity-10">
                {segment.icon}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-md font-medium mb-2 ${segment.textColor}`}>
                    {segment.name}
                  </h4>
                  <p className="text-2xl font-bold">{segment.count}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {(segment.count / data.length * 100).toFixed(1)}% of
                    customers
                  </p>
                </div>
                <div className="mt-1">{segment.icon}</div>
              </div>
            </motion.div>)}
        </div>
      </div>
      <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-5">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          Recommended Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-5 rounded-lg relative overflow-hidden" whileHover={{
          scale: 1.02,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }}>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-medium mb-3 text-red-400 flex items-center">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              High Risk Customers
            </h4>
            <ul className="list-none text-gray-300 space-y-2 relative z-10">
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Immediate outreach with personalized offers
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Schedule account review calls
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Offer loyalty program enrollment
              </li>
            </ul>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 p-5 rounded-lg relative overflow-hidden" whileHover={{
          scale: 1.02,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }}>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            <h4 className="font-medium mb-3 text-yellow-400 flex items-center">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              Medium Risk Customers
            </h4>
            <ul className="list-none text-gray-300 space-y-2 relative z-10">
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Email campaign with targeted promotions
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Product usage tutorials
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Feedback surveys with incentives
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>;
};
export default ChurnMetrics;