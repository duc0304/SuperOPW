'use client';

import { useState, useEffect, useRef } from 'react';
import { RiSearchLine, RiFilterLine, RiArrowUpLine, RiArrowDownLine, RiAlertLine } from 'react-icons/ri';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  date: string;
  type: 'payment' | 'refund';
  status: 'success' | 'failed';
}

// Mock data for chart
const chartData = [
  { date: '03/15', transactions: 45, amount: 15000 },
  { date: '03/16', transactions: 52, amount: 18000 },
  { date: '03/17', transactions: 49, amount: 12000 },
  { date: '03/18', transactions: 63, amount: 22000 },
  { date: '03/19', transactions: 58, amount: 19000 },
  { date: '03/20', transactions: 56, amount: 21000 },
  { date: '03/21', transactions: 62, amount: 24000 },
];

// Mock transactions with only one high-value transaction
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX001',
    customer: 'Enterprise Corp',
    amount: 15000, // High value transaction
    date: '2024-03-21 14:30',
    type: 'payment',
    status: 'success',
  },
  {
    id: 'TRX002',
    customer: 'Tech Solutions',
    amount: 5000,
    date: '2024-03-21 13:45',
    type: 'payment',
    status: 'success',
  },
  {
    id: 'TRX003',
    customer: 'Global Trading',
    amount: 30000, 
    date: '2024-03-21 12:15',
    type: 'payment',
    status: 'failed',
  },
  {
    id: 'TRX004',
    customer: 'Retail Chain',
    amount: 3500,
    date: '2024-03-21 11:30',
    type: 'refund',
    status: 'success',
  },
  {
    id: 'TRX005',
    customer: 'Mega Industries',
    amount: 1500, 
    date: '2024-03-21 10:45',
    type: 'payment',
    status: 'success',
  },
  // Add more transactions...
];

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const transactionsPerPage = 10;
  const chartRef = useRef<Chart | null>(null);

  // Calculate today's statistics
  const todayStats = {
    totalCount: 45,
    totalAmount: 156000,
    failedCount: 3,
  };

  // Filter transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter(transaction => 
    statusFilter === 'all' ? true : transaction.status === statusFilter
  );

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  useEffect(() => {
    const ctx = document.getElementById('transactionChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: chartData.map(d => d.date),
        datasets: [
          {
            label: 'Transaction Amount',
            data: chartData.map(d => d.amount),
            borderColor: '#818cf8',
            tension: 0.4,
            fill: false,
            yAxisID: 'y-amount'
          },
          {
            label: 'Transaction Count',
            data: chartData.map(d => d.transactions),
            borderColor: '#c4b5fd',
            tension: 0.4,
            fill: false,
            yAxisID: 'y-count'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          'y-amount': {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            }
          },
          'y-count': {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-soft">
            <p className="text-sm text-gray-500">Today's Transactions</p>
            <div className="flex items-baseline mt-1">
              <p className="text-xl font-bold">{todayStats.totalCount}</p>
              <p className="ml-2 text-xs text-green-600">
                <RiArrowUpLine className="inline mr-0.5" />
                +8%
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-soft">
            <p className="text-sm text-gray-500">Total Amount</p>
            <div className="flex items-baseline mt-1">
              <p className="text-xl font-bold">${todayStats.totalAmount.toLocaleString()}</p>
              <p className="ml-2 text-xs text-green-600">
                <RiArrowUpLine className="inline mr-0.5" />
                +12%
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-soft">
            <p className="text-sm text-gray-500">Failed Transactions</p>
            <div className="flex items-baseline mt-1">
              <p className="text-xl font-bold text-red-600">{todayStats.failedCount}</p>
              <p className="ml-2 text-xs text-red-600">
                <RiAlertLine className="inline mr-0.5" />
                Alert
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-soft">
            <p className="text-sm text-gray-500">Average Transaction</p>
            <div className="flex items-baseline mt-1">
              <p className="text-xl font-bold">
                ${(todayStats.totalAmount / todayStats.totalCount).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Chart and Insights Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Transaction Trend</h3>
              <select className="text-sm border rounded-lg px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64">
              <canvas id="transactionChart"></canvas>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-soft">
            <h3 className="text-sm font-semibold mb-4">Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Highest Transaction</p>
                <p className="text-sm font-medium mt-1">$25,000 - Mega Industries</p>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 font-medium">Recent Failed Transactions</p>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">Global Trading - $12,000</p>
                  <p className="text-sm">Tech Corp - $8,500</p>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium">Peak Transaction Hours</p>
                <p className="text-sm font-medium mt-1">2PM - 4PM (42% of daily)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border"
              />
            </div>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'success' | 'failed')}
            className="px-3 py-2 text-sm rounded-lg border"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
          <select className="px-3 py-2 text-sm rounded-lg border">
            <option>Amount: All</option>
            <option>Amount: Above $10,000</option>
            <option>Amount: Below $1,000</option>
          </select>
          <select className="px-3 py-2 text-sm rounded-lg border">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
          </select>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    transaction.amount >= 10000 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${transaction.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.type === 'payment'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * transactionsPerPage + 1} to {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-primary-500 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}