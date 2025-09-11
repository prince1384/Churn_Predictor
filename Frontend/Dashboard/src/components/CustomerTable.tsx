import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircleIcon, CheckCircleIcon, SearchIcon, ArrowUpIcon, ArrowDownIcon, FilterIcon } from 'lucide-react';
const CustomerTable = ({
  data,
  predictionColumn
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const itemsPerPage = 10;
  const isChurn = (value: any) => {
    const s = String(value ?? '').toLowerCase();
    return s === '1' || s === 'yes' || s === 'true' || s === 'churn' || s === 'positive';
  };
  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let filteredItems = [...data];
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => {
        return Object.values(item).some(val => val && val.toString().toLowerCase().includes(lowercasedTerm));
      });
    }
    // Apply sorting
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredItems;
  }, [data, searchTerm, sortConfig]);
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // Handle sort
  const handleSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({
      key,
      direction
    });
  };
  // Get table headers from data
  const headers = data && data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'id') : [];
  // Limit headers to prevent overflow
  const displayHeaders = headers.slice(0, 6);
  if (!data || data.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 bg-gray-900/50 rounded-lg border border-gray-700/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-400 text-lg">No customer data available</p>
        <p className="text-gray-500 text-sm mt-2">
          Upload a CSV file with customer data to view results
        </p>
      </div>;
  }
  return <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="bg-gray-900/70 text-white pl-10 pr-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50 backdrop-blur-sm" placeholder="Search customers..." value={searchTerm} onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
          const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
          const rows = filteredData.map(row => headers.map(h => (row[h] ?? '')));
          const csv = [headers.join(','), ...rows.map(r => r.map(v => String(v).includes(',') ? `"${String(v).replace(/"/g, '""')}"` : v).join(','))].join('\n');
          const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'customers_filtered.csv';
          a.click();
          URL.revokeObjectURL(url);
        }} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700/50 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-gray-700/70">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
            <tr>
              {displayHeaders.map(header => <th key={header} scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort(header)}>
                  <div className="flex items-center">
                    {header}
                    {sortConfig.key === header ? <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
                      </span> : <span className="ml-1 text-gray-500">
                        <ArrowUpIcon size={14} />
                      </span>}
                  </div>
                </th>)}
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Churn Risk
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
            {currentItems.map((customer, index) => <motion.tr key={index} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: index * 0.05
          }} whileHover={{
            backgroundColor: 'rgba(255,255,255,0.05)'
          }} className="hover:bg-gray-700/20 transition-colors">
                {displayHeaders.map(header => <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {customer[header]}
                  </td>)}
                <td className="px-6 py-4 whitespace-nowrap">
                  {isChurn(predictionColumn ? customer[predictionColumn] : customer.churn) ? <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-600/30 to-red-500/30 text-red-200 border border-red-500/30">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      High Risk
                    </span> : <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-600/30 to-green-500/30 text-green-200 border border-green-500/30">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Low Risk
                    </span>}
                </td>
              </motion.tr>)}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 mt-4 rounded-lg border border-gray-700/50 backdrop-blur-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                ${currentPage === 1 ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              Previous
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${currentPage === totalPages ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing{' '}
                <span className="font-medium text-white">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-white">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-white">
                  {filteredData.length}
                </span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-3 py-2 rounded-l-md text-sm font-medium
                    ${currentPage === 1 ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  <span className="sr-only">Previous</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {[...Array(totalPages).keys()].map(number => <button key={number} onClick={() => setCurrentPage(number + 1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                      ${currentPage === number + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    {number + 1}
                  </button>)}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`relative inline-flex items-center px-3 py-2 rounded-r-md text-sm font-medium
                    ${currentPage === totalPages ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  <span className="sr-only">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>}
    </div>;
};
export default CustomerTable;