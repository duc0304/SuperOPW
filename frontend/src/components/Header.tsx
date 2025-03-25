'use client';

import { useState } from 'react';
import { RiMenu2Line, RiNotification3Line, RiTranslate2, RiLogoutBoxLine, RiUserSettingsLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        logout();
        router.push('/login');
      } else {
        console.error('Logout failed');
        localStorage.removeItem('token');
        logout();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('token');
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 z-30">
      <div className="h-full px-4 md:px-6 flex items-center justify-between bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 shadow-md backdrop-blur-sm">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg bg-indigo-100/30 backdrop-blur-sm hover:bg-indigo-200/40 transition-colors md:hidden"
          >
            <RiMenu2Line className="w-5 h-5 text-indigo-700" />
          </button>
          <h1 className="text-indigo-700 font-bold text-xl hidden md:block">Way4 Pro</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3 md:space-x-5">
          <button className="p-2 rounded-lg bg-indigo-100/30 backdrop-blur-sm hover:bg-indigo-200/40 transition-colors">
            <RiNotification3Line className="w-5 h-5 text-indigo-700" />
          </button>
          
          {/* Language selector */}
          <div className="hidden md:flex items-center">
            <button className="flex items-center gap-2 p-2 rounded-lg bg-indigo-100/30 backdrop-blur-sm hover:bg-indigo-200/40 transition-colors">
              <RiTranslate2 className="w-5 h-5 text-indigo-700" />
              <span className="text-indigo-700 text-sm font-medium">English</span>
            </button>
          </div>
          
          {/* User profile with dropdown */}
          <div className="relative">
            <div 
              className="flex items-center space-x-3 cursor-pointer bg-indigo-100/30 backdrop-blur-sm hover:bg-indigo-200/40 transition-all rounded-lg px-3 py-2"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                <span>JD</span>
              </div>
              <span className="hidden md:inline text-indigo-700 font-medium">John Doe</span>
            </div>
            
            {/* User dropdown menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-indigo-50 rounded-xl shadow-lg py-2 z-50 border border-indigo-200">
                <div className="px-4 py-3 border-b border-indigo-200">
                  <p className="font-medium text-indigo-800">John Doe</p>
                  <p className="text-sm text-indigo-500">john.doe@example.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button className="w-full text-left px-4 py-2.5 hover:bg-indigo-100 flex items-center gap-2 text-indigo-700">
                      <RiUserSettingsLine className="w-5 h-5 text-indigo-500" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
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