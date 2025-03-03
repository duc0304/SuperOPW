'use client';

import { useState } from 'react';
import { RiArrowRightUpLine, RiArrowRightDownLine } from 'react-icons/ri';

// Mock data for recent customers
const recentCustomers = [
  { id: 1, name: 'Olivia Martin', email: 'olivia.martin@email.com', status: 'active' },
  { id: 2, name: 'Jackson Lee', email: 'jackson.lee@email.com', status: 'inactive' },
  { id: 3, name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', status: 'active' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 dark:shadow-lg dark:shadow-indigo-900/10 p-6 rounded-xl shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-indigo-100">Welcome back, Admin</h1>
              <p className="text-gray-500 dark:text-indigo-300/70">Here's what's happening with your business today.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="px-4 py-2 bg-primary-50 dark:bg-indigo-900/50 text-primary-700 dark:text-indigo-200 rounded-lg hover:bg-primary-100 dark:hover:bg-indigo-800/70 transition-colors duration-200">
                View Reports
              </button>
              <button className="px-4 py-2 bg-primary-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-indigo-700 transition-colors duration-200">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Customers */}
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-indigo-300/70">Total Customers</h3>
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <span className="text-primary-600 dark:text-indigo-200">👥</span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-indigo-100">2,420</span>
              <span className="ml-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                <RiArrowRightUpLine className="mr-1" />
                +5.2%
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-indigo-300/50">Compared to last month</p>
          </div>

          {/* Active Contracts */}
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-indigo-300/70">Active Contracts</h3>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <span className="text-blue-600 dark:text-indigo-200">📄</span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-indigo-100">1,210</span>
              <span className="ml-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                <RiArrowRightUpLine className="mr-1" />
                +10.6%
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-indigo-300/50">Compared to last month</p>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-indigo-300/70">Monthly Revenue</h3>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <span className="text-green-600 dark:text-indigo-200">💰</span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-indigo-100">$24,300</span>
              <span className="ml-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <RiArrowRightDownLine className="mr-1" />
                -3.1%
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-indigo-300/50">Compared to last month</p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-indigo-300/70">Pending Tasks</h3>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-indigo-900/50 p-2 rounded-lg dark:text-indigo-200">
                <span className="bg-red-100 dark:bg-indigo-900/50 p-2 rounded-lg dark:text-indigo-200">⏳</span>
              </div>
            </div>
            <div className="text-yellow-500 dark:text-yellow-400 text-xs">12 require attention</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4 dark:text-indigo-100">Revenue Overview</h2>
            <canvas id="revenueChart" height="200"></canvas>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 p-6 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4 dark:text-indigo-100">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                  <span className="text-primary-700 dark:text-indigo-300 font-medium">OM</span>
                </div>
                <div>
                  <p className="font-medium">
                    <span className="text-gray-900 dark:text-indigo-100">Olivia Martin</span>
                    <span className="text-gray-500 dark:text-indigo-300/70"> signed a new contract</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-indigo-300/50">2 minutes ago</p>
                </div>
              </div>
              {/* More activity items */}
            </div>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 hover:shadow-lg transition-shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 dark:text-indigo-100">Recent Customers</h2>
          <div className="space-y-4">
            {recentCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                    <span className="text-primary-700 dark:text-indigo-300 font-medium">{customer.name.charAt(0)}{customer.name.split(' ')[1].charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-indigo-100">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-indigo-300/50">{customer.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  customer.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {customer.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 