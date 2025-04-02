"use client";

import { ReactNode, ElementType } from "react";
import Link from "next/link";

interface LinkProps {
  href: string;
  text: string;
}

interface InfoCardProps {
  icon: ElementType;
  label: string;
  value?: string | number | null;
  colors: {
    bg: string;
    cardBorder: string;
    cardBg: string;
    cardHoverBorder?: string;
  };
  link?: LinkProps;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
  colors,
  link,
}: InfoCardProps) => (
  <div
    className={`p-3 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
  >
    <div className="flex items-start">
      <div className={`p-2 rounded-lg mr-2 shadow-sm text-white ${colors.bg}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="font-medium text-gray-800 dark:text-gray-100 text-base">
          {value || "N/A"}
        </p>
        {link && (
          <Link
            href={link.href}
            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors mt-0.5 inline-flex items-center hover:underline"
          >
            {link.text}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2.5 w-2.5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default InfoCard;
