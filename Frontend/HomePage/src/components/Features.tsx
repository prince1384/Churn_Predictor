import React from 'react';
import { BarChart3, Users, Bell, TrendingUp, Zap, LineChart } from 'lucide-react';
export function Features() {
  const features = [{
    icon: <BarChart3 size={32} className="text-white" />,
    title: 'Predictive Analytics',
    description: 'Leverage machine learning algorithms to identify customers at risk of churning with high accuracy.'
  }, {
    icon: <Users size={32} className="text-white" />,
    title: 'Customer Segmentation',
    description: 'Group customers based on behavior patterns and churn risk for targeted retention strategies.'
  }, {
    icon: <Bell size={32} className="text-white" />,
    title: 'Early Warning System',
    description: 'Get alerted when customers show signs of disengagement before they decide to leave.'
  }, {
    icon: <TrendingUp size={32} className="text-white" />,
    title: 'Trend Analysis',
    description: 'Track churn metrics over time to identify patterns and measure the impact of retention efforts.'
  }, {
    icon: <Zap size={32} className="text-white" />,
    title: 'Real-time Insights',
    description: 'Monitor customer behavior in real-time and receive instant updates on churn risk changes.'
  }, {
    icon: <LineChart size={32} className="text-white" />,
    title: 'ROI Tracking',
    description: 'Measure the financial impact of your retention strategies and calculate savings from reduced churn.'
  }];
  return <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive suite of tools gives you everything you need to
            reduce customer churn and boost retention.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>)}
        </div>
        <div className="mt-20 text-center">
          <div className="inline-block p-1 bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg">
            <button className="bg-black px-8 py-3 rounded-md font-medium hover:bg-gray-900 transition-colors">
              Explore All Features
            </button>
          </div>
        </div>
      </div>
    </section>;
}