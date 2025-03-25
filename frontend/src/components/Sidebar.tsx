'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { RiUserLine, RiFileListLine, RiSettings4Line } from 'react-icons/ri';

interface SidebarProps {
  isOpen: boolean;
}

const MENU_ITEMS = [
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
    href: "/setting",
    icon: RiSettings4Line,
    text: "Setting"
  }
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`fixed left-0 top-0 h-full bg-purple-50 border-r border-indigo-200 z-40 transition-all duration-300 backdrop-blur-sm shadow-md ${
      isOpen ? 'w-16 md:w-64' : 'w-0 overflow-hidden'
    }`}>
      {/* Logo */}
      <div className="flex items-center space-x-2 px-5 h-16 border-b border-indigo-200 bg-indigo-100/80 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center shadow-md">
          <span className="text-white font-bold">W4</span>
        </div>
        <span className="hidden md:inline text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Way4 Pro
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? 'bg-indigo-500 text-white font-medium shadow-sm' 
                : 'hover:bg-indigo-100/50 text-indigo-700 hover:text-indigo-800'
            }`}>
              <item.icon className={`w-5 h-5 ${
                pathname === item.href || pathname.startsWith(`${item.href}/`) 
                  ? 'text-white' 
                  : 'text-indigo-500'
              }`} />
              <span className="hidden md:inline">{item.text}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}