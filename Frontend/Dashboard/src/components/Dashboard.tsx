import React, { useEffect, useState } from 'react';
import ChurnMetrics from './ChurnMetrics';
import ChurnChart from './charts/ChurnChart';
import ThreeDMetric from './3D/ThreeDMetric';
import CustomerTable from './CustomerTable';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon, PieChartIcon, LineChartIcon, UserIcon, AlertTriangleIcon, ShieldIcon, UsersIcon } from 'lucide-react';
const Dashboard = ({
  data,
  isLoading,
  predictionColumn,
  classDistribution
}) => {
  const [metrics, setMetrics] = useState({
    churnRate: 0 as number,
    atRiskCount: 0 as number,
    retentionRate: 0 as number,
    totalCustomers: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    if (data && data.length) {
      // Prefer backend classDistribution when available, else derive from records
      const totalCustomers = data.length;
      let churnedCustomers = 0;
      if (classDistribution) {
        const total = Object.values(classDistribution).reduce((a, b) => a + (b as number), 0);
        const churned = (classDistribution['1'] || 0) as number
          + (classDistribution['Yes'] || 0) as number
          + (classDistribution['True'] || 0) as number
          + (classDistribution['Churn'] || 0) as number;
        churnedCustomers = typeof churned === 'number' && churned > 0 ? churned : 0;
        // Fallback if labels are strings like '0'/'1' but only '0' present
        if (churnedCustomers === 0 && total > 0 && classDistribution['0'] !== undefined) {
          churnedCustomers = total - (classDistribution['0'] as number);
        }
      } else {
        const isChurn = (val) => {
          if (val === undefined || val === null) return false;
          const s = String(val).toLowerCase();
          return s === '1' || s === 'yes' || s === 'true' || s === 'churn' || s === 'positive';
        };
        churnedCustomers = data.filter(customer => {
          const value = predictionColumn ? customer[predictionColumn] : customer.churn;
          return isChurn(value);
        }).length;
      }
      const atRiskCustomers = Math.round(totalCustomers * 0.3);
      const churnRatePct = totalCustomers > 0 ? (churnedCustomers / totalCustomers) * 100 : 0;
      const retentionPct = totalCustomers > 0 ? ((totalCustomers - churnedCustomers) / totalCustomers) * 100 : 0;
      setMetrics({
        churnRate: Number(churnRatePct),
        atRiskCount: atRiskCustomers,
        retentionRate: Number(retentionPct),
        totalCustomers
      });
    }
  }, [data, predictionColumn, classDistribution]);
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-t-4 border-b-4 border-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>;
  }
  const metricCards = [{
    title: 'Churn Rate',
    value: metrics.churnRate.toFixed(1) + '%',
    icon: <AlertTriangleIcon size={24} />,
    isPositive: metrics.churnRate <= 20,
    indicator: metrics.churnRate > 20 ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />,
    gradient: 'from-red-500/20 to-orange-500/20',
    iconBg: 'from-red-500/30 to-orange-500/30'
  }, {
    title: 'At Risk Customers',
    value: metrics.atRiskCount,
    icon: <UserIcon size={24} />,
    isPositive: metrics.atRiskCount <= metrics.totalCustomers * 0.3,
    indicator: metrics.atRiskCount > metrics.totalCustomers * 0.3 ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />,
    gradient: 'from-yellow-500/20 to-amber-500/20',
    iconBg: 'from-yellow-500/30 to-amber-500/30'
  }, {
    title: 'Retention Rate',
    value: metrics.retentionRate.toFixed(1) + '%',
    icon: <ShieldIcon size={24} />,
    isPositive: metrics.retentionRate >= 70,
    indicator: metrics.retentionRate < 70 ? <ArrowDownIcon size={20} /> : <ArrowUpIcon size={20} />,
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconBg: 'from-green-500/30 to-emerald-500/30'
  }, {
    title: 'Total Customers',
    value: metrics.totalCustomers,
    icon: <UsersIcon size={24} />,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    iconBg: 'from-blue-500/30 to-indigo-500/30'
  }];
  return <div className="space-y-8">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => <motion.div key={index} className={`bg-gradient-to-br ${card.gradient} backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden`} whileHover={{
        scale: 1.03,
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)'
      }} transition={{
        type: 'spring',
        stiffness: 300
      }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-white rounded-full transform translate-x-8 translate-y-8"></div>
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-gray-300 font-medium">{card.title}</h3>
                <p className="text-3xl font-bold mt-1 text-white">
                  {card.value}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.iconBg} flex items-center justify-center mb-2`}>
                  {card.icon}
                </div>
                {card.indicator && <div className={`flex items-center ${card.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {card.indicator}
                  </div>}
              </div>
            </div>
          </motion.div>)}
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-700/50 backdrop-blur-sm">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('overview')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === 'overview' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg ${activeTab === 'overview' ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30' : 'bg-gray-800'} flex items-center justify-center mr-2`}>
                <BarChart3Icon size={18} />
              </div>
              Overview
            </div>
          </button>
          <button onClick={() => setActiveTab('predictions')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === 'predictions' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg ${activeTab === 'predictions' ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30' : 'bg-gray-800'} flex items-center justify-center mr-2`}>
                <PieChartIcon size={18} />
              </div>
              Predictions
            </div>
          </button>
          <button onClick={() => setActiveTab('customers')} className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === 'customers' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg ${activeTab === 'customers' ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30' : 'bg-gray-800'} flex items-center justify-center mr-2`}>
                <LineChartIcon size={18} />
              </div>
              Customer Data
            </div>
          </button>
        </nav>
      </div>
      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div className="bg-gradient-to-br from-gray-800/80 to-gray-900 border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(60,60,60,0.1),transparent_70%)] pointer-events-none"></div>
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center mr-2">
                  <PieChartIcon size={18} />
                </div>
                Churn Distribution
              </h3>
              <ChurnChart data={data} predictionColumn={predictionColumn} classDistribution={classDistribution} />
            </motion.div>
            <motion.div className="bg-gradient-to-br from-gray-800/80 to-gray-900 border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(60,60,60,0.1),transparent_70%)] pointer-events-none"></div>
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                3D Risk Visualization
              </h3>
              <ThreeDMetric key={metrics.churnRate.toFixed(1)} churnRate={metrics.churnRate} />
            </motion.div>
          </div>}
        {activeTab === 'predictions' && <motion.div className="bg-gradient-to-br from-gray-800/80 to-gray-900 border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(60,60,60,0.1),transparent_70%)] pointer-events-none"></div>
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center mr-2">
                <AlertTriangleIcon size={18} />
              </div>
              Churn Predictions
            </h3>
            <ChurnMetrics data={data} />
          </motion.div>}
        {activeTab === 'customers' && <motion.div className="bg-gradient-to-br from-gray-800/80 to-gray-900 border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(60,60,60,0.1),transparent_70%)] pointer-events-none"></div>
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mr-2">
                <UsersIcon size={18} />
              </div>
              Customer Data
            </h3>
            <CustomerTable data={data} predictionColumn={predictionColumn} />
          </motion.div>}
      </div>
    </div>;
};
export default Dashboard;