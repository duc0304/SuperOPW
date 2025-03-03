'use client';

import { RiUserLine, RiNotification3Line, RiGlobalLine, RiShieldLine } from 'react-icons/ri';

export default function SettingsPage() {
  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-6">
              <RiUserLine className="w-6 h-6 text-primary-500" />
              <div>
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <p className="text-gray-500 text-sm">Update your personal information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-6">
              <RiNotification3Line className="w-6 h-6 text-primary-500" />
              <div>
                <h2 className="text-lg font-semibold">Notification Settings</h2>
                <p className="text-gray-500 text-sm">Configure your notification preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive SMS updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-6">
              <RiGlobalLine className="w-6 h-6 text-primary-500" />
              <div>
                <h2 className="text-lg font-semibold">Language & Region</h2>
                <p className="text-gray-500 text-sm">Set your language and regional preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all">
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all">
                  <option value="utc">UTC</option>
                  <option value="gmt+7">GMT+7</option>
                  <option value="gmt-5">GMT-5</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4 mb-6">
              <RiShieldLine className="w-6 h-6 text-primary-500" />
              <div>
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-gray-500 text-sm">Manage your security settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-500">Update your password</p>
              </button>
              <button className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}