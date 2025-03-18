'use client';

import { useState } from 'react';
import { RiMenu2Line, RiNotification3Line, RiSearchLine, RiTranslate2, RiLogoutBoxLine, RiUserSettingsLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Gọi API logout
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Xóa token từ localStorage
        localStorage.removeItem('token');
        
        // Cập nhật trạng thái đăng nhập trong context
        logout();
        
        // Chuyển hướng về trang đăng nhập
        router.push('/login');
      } else {
        console.error('Logout failed');
        // Vẫn xóa token và đăng xuất ở client nếu API thất bại
        localStorage.removeItem('token');
        logout();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Vẫn xóa token và đăng xuất ở client nếu có lỗi
      localStorage.removeItem('token');
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white shadow-soft z-30">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-primary-50 transition-colors md:hidden"
          >
            <RiMenu2Line className="w-5 h-5 text-gray-600" />
          </button>
          {/* Search bar - Only show on desktop */}
          <div className="relative hidden md:block">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients, contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[400px] pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors">
            <RiNotification3Line className="w-5 h-5 text-gray-600" />
          </button>
          {/* Language selector - Hide on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors">
              <RiTranslate2 className="w-5 h-5 text-gray-600" />
            </button>
            <select className="text-sm font-medium bg-transparent cursor-pointer hover:bg-primary-50 p-2 rounded-lg transition-colors">
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
          {/* User profile with dropdown */}
          <div className="relative">
            <div 
              className="flex items-center space-x-3 pl-2 md:pl-4 border-l cursor-pointer"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white">
                <span>JD</span>
              </div>
              <span className="hidden md:inline font-medium">John Doe</span>
            </div>
            
            {/* User dropdown menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                      <RiUserSettingsLine className="w-5 h-5 text-gray-500" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    >
                      <RiLogoutBoxLine className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
