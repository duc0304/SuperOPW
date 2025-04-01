"use client";

import { useState, useEffect } from "react";
import {
  RiFileTextLine,
  RiCalendarLine,
  RiExchangeFundsLine,
  RiInformationLine,
  RiArrowRightSLine,
  RiIdCardLine,
  RiUser3Line,
  RiBankLine,
  RiHashtag,
  RiFileUserLine,
  RiCloseLine,
  RiFileListLine,
} from "react-icons/ri";
import Link from "next/link";
import { ContractNode } from "../types";
import { createPortal } from "react-dom";

// Custom animation keyframes
const animationStyles = `
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    75%, 100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }
  
  .animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Kiểm tra loại contract
  const isIssueContract =
    contract.oracleData?.LIAB_CONTRACT !== undefined &&
    contract.oracleData?.LIAB_CONTRACT !== null &&
    contract.oracleData?.LIAB_CONTRACT !== "";

  const isCardContract =
    (contract.oracleData?.CARD_NUMBER?.length === 16 &&
      contract.oracleData?.CARD_NUMBER?.startsWith("10000")) ||
    (contract.oracleData?.CONTRACT_NUMBER?.length === 16 &&
      contract.oracleData?.CONTRACT_NUMBER?.startsWith("10000"));

  // Animation effect khi contract thay đổi
  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [contract.id]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get the appropriate title based on contract type
  const getContractTypeTitle = () => {
    if (isIssueContract) {
      return "Issuing Contract";
    } else if (isCardContract) {
      return "Card Contract";
    } else {
      return "Liability Contract";
    }
  };

  // Helper function to get color scheme based on contract type
  const getColorScheme = (contractType: string) => {
    switch (contractType) {
      case "issue":
        return {
          bg: "bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
          text: "text-white",
          borderLight: "border-indigo-200/50 dark:border-indigo-700/40",
          iconFill: "fill-indigo-500 dark:fill-indigo-400",
          cardBorder: "border-indigo-200/50 dark:border-indigo-700/40",
          cardBg: "bg-indigo-50/50 dark:bg-indigo-900/20",
          cardHoverBorder: "border-indigo-300 dark:border-indigo-600",
          barFill: "bg-indigo-500 dark:bg-indigo-600",
        };
      case "card":
        return {
          bg: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800",
          text: "text-white",
          borderLight: "border-emerald-200/50 dark:border-emerald-700/40",
          iconFill: "fill-emerald-500 dark:fill-emerald-400",
          cardBorder: "border-emerald-200/50 dark:border-emerald-700/40",
          cardBg: "bg-emerald-50/50 dark:bg-emerald-900/20",
          cardHoverBorder: "border-emerald-300 dark:border-emerald-600",
          barFill: "bg-emerald-500 dark:bg-emerald-600",
        };
      case "liability":
      default:
        return {
          bg: "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800",
          text: "text-white",
          borderLight: "border-blue-200/50 dark:border-blue-700/40",
          iconFill: "fill-blue-500 dark:fill-blue-400",
          cardBorder: "border-blue-200/50 dark:border-blue-700/40",
          cardBg: "bg-blue-50/50 dark:bg-blue-900/20",
          cardHoverBorder: "border-blue-300 dark:border-blue-600",
          barFill: "bg-blue-500 dark:bg-blue-600",
        };
    }
  };

  const colors = getColorScheme(
    isIssueContract ? "issue" : isCardContract ? "card" : "liability"
  );

  // Hàm để render dữ liệu JSON dưới dạng danh sách key-value
  const renderJsonData = (data: any) => {
    if (!data)
      return (
        <p className="text-gray-500 dark:text-gray-400">
          No additional data available.
        </p>
      );

    const entries = Object.entries(data);

    return (
      <ul className="space-y-2">
        {entries.map(([key, value]) => (
          <li key={key} className="flex items-start">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
              {key}:
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {typeof value === "object" && value !== null
                ? JSON.stringify(value).slice(0, 50) +
                  (JSON.stringify(value).length > 50 ? "..." : "")
                : value?.toString() || "N/A"}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/30 bg-white dark:bg-gray-800/90 transition-all duration-300 h-auto md:h-[calc(100vh-180px)]">
      {/* Inject custom animation styles */}
      <style jsx>{animationStyles}</style>

      <div className="p-6 h-full flex flex-col overflow-hidden">
        {/* Header with animation */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between mb-6 transition-all duration-500 ease-out ${
            animateIn
              ? "opacity-100 transform-none"
              : "opacity-0 -translate-y-4"
          } rounded-xl p-5 shadow-lg relative overflow-hidden
          ${colors.bg}
          `}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>

          {/* Contract circle icon with ripple effect */}
          <div className="relative z-10 flex items-start md:items-center mb-4 md:mb-0">
            <div className="relative flex-shrink-0">
              <div
                className={`p-3 rounded-xl mr-4 shadow-md bg-white/20 backdrop-blur-sm transform transition-transform hover:scale-110 duration-300`}
              >
                {isIssueContract ? (
                  <RiExchangeFundsLine className="w-7 h-7 text-white" />
                ) : isCardContract ? (
                  <RiIdCardLine className="w-7 h-7 text-white" />
                ) : (
                  <RiFileTextLine className="w-7 h-7 text-white" />
                )}
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                {contract.oracleData?.CONTRACT_NAME || contract.title}
              </h2>
              <div className="flex items-center text-xs text-white/80 mt-1">
                <span className="mr-2 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 mr-1.5 animate-pulse"></span>
                  {getContractTypeTitle()}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white shadow-sm">
                  {contract.oracleData?.CONTRACT_NUMBER ||
                    contract.liability?.contractNumber ||
                    "No number"}
                </span>
              </div>
            </div>
          </div>

          {/* Right side decorative pattern */}
          <div className="hidden md:block relative z-10">
            <div className="absolute top-0 right-0 w-16 h-16 border-4 border-white/20 rounded-xl rotate-12"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-white/30 rounded-full"></div>
            <div className="text-white/80 text-sm ml-5">
              {formatDate(contract.oracleData?.AMND_DATE)}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div
            className={`space-y-6 transition-all duration-500 ease-out ${
              animateIn
                ? "opacity-100 transform-none"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Main Contract Information */}
            <div
              className={`overflow-hidden rounded-xl shadow-lg border ${colors.cardBorder}`}
            >
              {/* Header */}
              <div
                className={`px-5 py-4 ${colors.bg} relative overflow-hidden rounded-t-xl shadow-md`}
              >
                {/* Trang trí */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                <h3
                  className={`text-lg font-semibold text-white flex items-center relative z-10`}
                >
                  <div
                    className={`p-2 rounded-lg mr-3 bg-white/20 backdrop-blur-sm`}
                  >
                    {isIssueContract ? (
                      <RiExchangeFundsLine className={`w-5 h-5 text-white`} />
                    ) : isCardContract ? (
                      <RiIdCardLine className={`w-5 h-5 text-white`} />
                    ) : (
                      <RiFileTextLine className={`w-5 h-5 text-white`} />
                    )}
                  </div>
                  <span className="tracking-wide">CONTRACT DETAILS</span>
                </h3>
              </div>

              {/* Contract Info */}
              <div
                className={`p-5 rounded-b-xl border-x border-b ${colors.cardBorder} ${colors.cardBg} hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Contract ID */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiHashtag className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Contract ID
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {contract.oracleData?.ID || contract.id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contract Name */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiFileUserLine className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Contract Name
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {contract.oracleData?.CONTRACT_NAME || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contract Number */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiFileTextLine className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Contract Number
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {contract.oracleData?.CONTRACT_NUMBER || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Branch */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiBankLine className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Branch
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {contract.oracleData?.BRANCH || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Client ID */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiUser3Line className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Client ID
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {contract.oracleData?.CLIENT__ID || "N/A"}
                        </p>
                        {contract.oracleData?.CLIENT__ID && (
                          <Link
                            href={`/clients/${contract.oracleData.CLIENT__ID}`}
                            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors mt-1 inline-flex items-center hover:underline"
                          >
                            View Client Details
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 ml-1"
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

                  {/* Amendment Date */}
                  <div
                    className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} hover:shadow-md hover:${colors.cardHoverBorder} transition-all duration-300 transform hover:translate-y-[-2px]`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg mr-3 shadow-sm text-white ${colors.bg}`}
                      >
                        <RiCalendarLine className={`w-4 h-4`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Amendment Date
                        </p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {formatDate(contract.oracleData?.AMND_DATE)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Registration Info - Only show if it's a card contract */}
            {isCardContract && (
              <div
                className={`overflow-hidden rounded-xl shadow-lg border ${colors.cardBorder} relative`}
              >
                {/* Header */}
                <div
                  className={`relative px-5 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 shadow-md`}
                >
                  {/* Hiệu ứng ánh sáng quét qua */}
                  <div className="absolute inset-0 bg-white/10 blur-md opacity-0 animate-[shimmer_2s_infinite]"></div>

                  {/* Trang trí */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                  <h3 className="text-lg font-semibold text-white flex items-center relative z-10">
                    <div className="p-2 rounded-lg mr-3 bg-white/20 backdrop-blur-sm">
                      <RiIdCardLine className="w-5 h-5 text-white opacity-90" />
                    </div>
                    <span className="tracking-wide">CARD REGISTRATION</span>
                  </h3>
                </div>

                {/* Card Preview */}
                <div className="p-5 bg-white">
                  {/* Thẻ vật lý */}
                  <div className="mb-6">
                    <div
                      className="relative w-full max-w-[425px] h-[270px] mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl cursor-pointer"
                      onClick={() => setShowCardModal(true)}
                    >
                      {/* Nền thẻ */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url(/card-bg.jpg)" }}
                      />

                      {/* Hiệu ứng lớp phủ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                      {/* Tên ngân hàng */}
                      <div className="absolute top-[25px] left-[30px]">
                        <p className="text-white font-bold text-2xl tracking-wider">
                          HAICHANBANK
                        </p>
                      </div>

                      {/* Logo */}
                      <div className="absolute top-[-5px] right-[20px]">
                        <img
                          src="/mastercard.svg"
                          alt="MasterCard"
                          className="w-[90px] h-[90px]"
                        />
                      </div>

                      {/* Chip */}
                      <div className="absolute top-[100px] left-[30px]">
                        <img
                          src="/chip.png"
                          alt="Card Chip"
                          className="w-[60px] h-auto object-contain drop-shadow-md"
                        />
                      </div>

                      {/* Biểu tượng contactless */}
                      <div className="absolute top-[102px] left-[95px]">
                        <img
                          src="/contactless-indicator.png"
                          alt="Contactless"
                          className="w-[35px] h-auto opacity-70"
                        />
                      </div>

                      {/* Số thẻ với font OCR-A */}
                      <div className="absolute top-[160px] left-[30px] right-[30px]">
                        <p className="font-['OCR-A'] text-[22px] text-white tracking-[0.15em] whitespace-nowrap overflow-hidden">
                          {contract.oracleData?.CARD_NUMBER
                            ? contract.oracleData.CARD_NUMBER.replace(
                                /(\d{4})/g,
                                "$1 "
                              ).trim()
                            : "1000 0101 3559 6630"}
                        </p>
                      </div>

                      {/* Tên chủ thẻ */}
                      <div className="absolute bottom-[25px] left-[30px]">
                        <p className="text-xs text-white/80 uppercase tracking-wider mb-0.5">
                          CARD HOLDER
                        </p>
                        <p className="text-white uppercase font-medium text-sm">
                          {contract.oracleData?.TR_FIRST_NAM &&
                          contract.oracleData?.TR_LAST_NAM
                            ? `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}`
                            : "NAM DINH"}
                        </p>
                      </div>

                      {/* Ngày hết hạn */}
                      <div className="absolute bottom-[25px] right-[30px] text-right">
                        <p className="text-xs text-white/80 uppercase tracking-wider mb-0.5">
                          EXPIRES
                        </p>
                        <p className="text-white font-medium text-sm">MM/YY</p>
                      </div>

                      {/* View indicator */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                          Click to view full screen
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Info Table */}
                  <div
                    className={`bg-white dark:bg-gray-800 rounded-lg border ${colors.borderLight} overflow-hidden shadow-lg`}
                  >
                    <table className="w-full">
                      <tbody>
                        {/* Card Number */}
                        <tr
                          className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 w-1/3 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                          >
                            Card Number
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-mono">
                            {contract.oracleData?.CARD_NUMBER || "N/A"}
                          </td>
                        </tr>

                        {/* Card Holder */}
                        <tr
                          className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                          >
                            Card Holder
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {contract.oracleData?.TR_FIRST_NAM &&
                            contract.oracleData?.TR_LAST_NAM
                              ? `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}`
                              : "N/A"}
                          </td>
                        </tr>

                        {/* First Name */}
                        <tr
                          className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                          >
                            First Name
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {contract.oracleData?.TR_FIRST_NAM || "N/A"}
                          </td>
                        </tr>

                        {/* Last Name */}
                        <tr
                          className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                          >
                            Last Name
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {contract.oracleData?.TR_LAST_NAM || "N/A"}
                          </td>
                        </tr>

                        {/* Expiry Date */}
                        <tr
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                        >
                          <td
                            className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                          >
                            Expiry Date
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                            {contract.oracleData?.EXPR_DATE || "MM/YY"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="mt-8">
              {/* Additional Details Header */}
              <div
                className={`px-5 py-4 ${colors.bg} relative overflow-hidden rounded-t-xl shadow-md`}
              >
                {/* Trang trí */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                <h3
                  className={`text-lg font-semibold text-white flex items-center relative z-10`}
                >
                  <div
                    className={`p-2 rounded-lg mr-3 bg-white/20 backdrop-blur-sm`}
                  >
                    <RiFileListLine className={`w-5 h-5 text-white`} />
                  </div>
                  <span className="tracking-wide">ADDITIONAL DETAILS</span>
                </h3>
              </div>

              <div
                className={`p-4 rounded-b-xl border-x border-b ${colors.cardBorder} ${colors.cardBg} hover:shadow-md transition-all duration-300`}
              >
                {!showFullDetails ? (
                  <div>
                    <div className="max-h-[200px] overflow-hidden relative">
                      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full">
                          <tbody>
                            {Object.entries(contract?.oracleData || {})
                              .slice(0, 6)
                              .map(([key, value]) => (
                                <tr
                                  key={key}
                                  className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                                >
                                  <td
                                    className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 w-1/3 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                                  >
                                    {key}
                                  </td>
                                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                                    {typeof value === "object" && value !== null
                                      ? JSON.stringify(value).slice(0, 50) +
                                        (JSON.stringify(value).length > 50
                                          ? "..."
                                          : "")
                                      : value?.toString() || "N/A"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowFullDetails(true)}
                        className={`px-4 py-2 rounded-lg ${colors.bg} text-white hover:shadow-md transition-all duration-300`}
                      >
                        View More Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(contract?.oracleData || {}).map(
                            ([key, value]) => (
                              <tr
                                key={key}
                                className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                              >
                                <td
                                  className={`px-4 py-3 bg-gray-50 dark:bg-gray-700/50 w-1/3 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight}`}
                                >
                                  {key}
                                </td>
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                                  {typeof value === "object" && value !== null
                                    ? JSON.stringify(value).slice(0, 100) +
                                      (JSON.stringify(value).length > 100
                                        ? "..."
                                        : "")
                                    : value?.toString() || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setShowFullDetails(false)}
                        className={`px-4 py-2 rounded-lg ${colors.bg} text-white hover:shadow-md transition-all duration-300`}
                      >
                        Show Less
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render modal with portal */}
      {isMounted &&
        showCardModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setShowCardModal(false)}
          >
            <div className="absolute top-4 right-4 z-50">
              <button
                className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCardModal(false);
                }}
              >
                <RiCloseLine className="w-8 h-8 text-white" />
              </button>
            </div>

            <div
              className="relative w-[90vw] max-w-[1000px] h-auto aspect-[16/10] m-4 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nền thẻ */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/card-bg.jpg)" }}
              />

              {/* Hiệu ứng lớp phủ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

              {/* Hiệu ứng phản chiếu nhẹ */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>

              {/* Tên ngân hàng */}
              <div className="absolute top-[8%] left-[5%]">
                <p className="text-white font-bold text-4xl md:text-6xl tracking-wider">
                  HAICHANBANK
                </p>
              </div>

              {/* Logo - tăng kích thước */}
              <div className="absolute top-[-3%] right-[3%]">
                <img
                  src="/mastercard.svg"
                  alt="MasterCard"
                  className="w-[200px] md:w-[200px] h-auto"
                />
              </div>

              {/* Chip - tăng kích thước */}
              <div className="absolute top-[38%] left-[5%]">
                <img
                  src="/chip.png"
                  alt="Card Chip"
                  className="w-[150px] md:w-[150px] h-auto object-contain drop-shadow-md"
                />
              </div>

              {/* Biểu tượng contactless - tăng kích thước */}
              <div className="absolute top-[38%] left-[21%]">
                <img
                  src="/contactless-indicator.png"
                  alt="Contactless"
                  className="w-[90px] md:w-[90px] h-auto opacity-80"
                />
              </div>

              {/* Số thẻ với font OCR-A */}
              <div className="absolute top-[60%] left-[5%] right-[5%]">
                <p className="font-['OCR-A'] text-[5vmin] md:text-[5vmin] text-white tracking-[0.15em] whitespace-nowrap overflow-hidden">
                  {contract.oracleData?.CARD_NUMBER
                    ? contract.oracleData.CARD_NUMBER.replace(
                        /(\d{4})/g,
                        "$1 "
                      ).trim()
                    : "1000 0101 3559 6630"}
                </p>
              </div>

              {/* Tên chủ thẻ */}
              <div className="absolute bottom-[8%] left-[5%]">
                <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">
                  CARD HOLDER
                </p>
                <p className="text-white uppercase font-medium text-2xl md:text-4xl">
                  {contract.oracleData?.TR_FIRST_NAM &&
                  contract.oracleData?.TR_LAST_NAM
                    ? `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}`
                    : "NAM DINH"}
                </p>
              </div>

              {/* Ngày hết hạn */}
              <div className="absolute bottom-[8%] right-[5%] text-right">
                <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">
                  EXPIRES
                </p>
                <p className="text-white font-medium text-2xl md:text-4xl">
                  MM/YY
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
