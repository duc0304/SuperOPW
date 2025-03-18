'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { RiDashboardLine, RiUserLine, RiFileListLine, RiExchangeDollarLine, RiSettings4Line } from 'react-icons/ri';

interface SidebarProps {
  isOpen: boolean;
}

const MENU_ITEMS = [
  {
    href: "/dashboard",
    icon: RiDashboardLine,
    text: "Dashboard"
  },
  {
    href: "/clients",
    icon: RiUserLine,
    text: "Clients"
  },
  {
    href: "/contracts",
    icon: RiFileListLine,
    text: "Contracts"
  },
  {
    href: "/transactions",
    icon: RiExchangeDollarLine,
    text: "Transactions"
  },
  {
    href: "/setting",
    icon: RiSettings4Line,
    text: "Setting"
  }
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 transition-all duration-300 ${
      isOpen ? 'w-16 md:w-64' : 'w-0 overflow-hidden'
    }`}>
      {/* Logo */}
      <div className="flex items-center space-x-2 px-4 h-16 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center">
          <span className="text-white font-bold">W4</span>
        </div>
        <span className="hidden md:inline text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Way4 Pro
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              pathname === item.href
                ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 font-medium' 
                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
            }`}>
              <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-primary-500' : ''}`} />
              <span className="hidden md:inline">{item.text}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
