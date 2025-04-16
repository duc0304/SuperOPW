"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiUserLine, RiFileListLine, RiSettings4Line } from "react-icons/ri";

// Sử dụng lại các menu item từ Sidebar
const MOBILE_MENU_ITEMS = [
  {
    href: "/clients",
    icon: RiUserLine,
    text: "Clients",
  },
  {
    href: "/contracts",
    icon: RiFileListLine,
    text: "Contracts",
  },
  {
    href: "/setting",
    icon: RiSettings4Line,
    text: "Setting",
  },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-indigo-50 border-t border-indigo-200 z-30 md:hidden">
      <div className="flex justify-around items-center h-16">
        {MOBILE_MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex flex-col items-center px-4 py-2 rounded-xl ${
                  isActive
                    ? "bg-indigo-500 shadow-sm"
                    : "hover:bg-indigo-100/50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-indigo-500"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-white font-medium" : "text-indigo-500"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
