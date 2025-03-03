'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDashboardLine, RiUserLine, RiFileListLine, RiExchangeDollarLine, RiSettings4Line } from 'react-icons/ri';

const MOBILE_MENU_ITEMS = [
  {
    href: "/",
    icon: RiDashboardLine,
    text: "Dashboard"
  },
  {
    href: "/customers",
    icon: RiUserLine,
    text: "Customers"
  },
  {
    href: "/contracts",
    icon: RiFileListLine,
    text: "Contracts"
  },
  {
    href: "/transactions",
    icon: RiExchangeDollarLine,
    text: "Trans"
  },
  {
    href: "/setting",
    icon: RiSettings4Line,
    text: "Setting"
  }
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around items-center h-16">
      {MOBILE_MENU_ITEMS.map((item) => (
        <Link key={item.href} href={item.href}>
          <div className="flex flex-col items-center">
            <item.icon 
              className={`w-6 h-6 ${
                pathname === item.href 
                  ? 'text-primary-500' 
                  : 'text-gray-500'
              }`} 
            />
            <span className={`text-xs mt-1 ${
              pathname === item.href 
                ? 'text-primary-500 font-medium' 
                : 'text-gray-500'
            }`}>
              {item.text}
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
} 