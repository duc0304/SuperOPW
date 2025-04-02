"use client";

import { useState, useEffect, useRef } from "react";
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
  RiLockLine,
  RiLockUnlockLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseFill,
} from "react-icons/ri";
import Link from "next/link";
import { ContractNode } from "../types";
import Image from "next/image";
import InfoCard from "./InfoCard";
import { getColorScheme } from "../utils/getColorScheme";
import CreditCardModal from "./CreditCardModal";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/toastSlice";

// Khởi tạo state lockedContracts từ localStorage
const getInitialLockedState = () => {
  if (typeof window === "undefined") return {};
  try {
    const savedState = localStorage.getItem("lockedContracts");
    return savedState ? JSON.parse(savedState) : {};
  } catch (error) {
    console.error("Error loading locked contracts state:", error);
    return {};
  }
};

// State chia sẻ giữa các instance của component
const lockedContractsState = getInitialLockedState();

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
  
  @keyframes flash {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.5; }
  }
  
  .animate-flash {
    animation: flash 1s ease-in-out;
  }
`;

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const dispatch = useDispatch();
  const [animateIn, setAnimateIn] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  // State để lưu trữ tất cả các hợp đồng đang bị khóa
  const [lockedContracts, setLockedContracts] = useState<{
    [key: string]: boolean;
  }>(lockedContractsState);
  // State local có được tính toán từ lockedContracts
  const isLocked = lockedContracts[contract.id] || false;

  // State cho chức năng xác thực mã số
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Mã xác thực cố định (trong thực tế, nên được lấy từ API hoặc một nguồn an toàn)
  const VERIFICATION_CODE = "123456";

  // Ref cho input ẩn
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra loại contract
  const isIssueContract =
    contract.oracleData?.LIAB_CONTRACT !== undefined &&
    contract.oracleData?.LIAB_CONTRACT !== null &&
    String(contract.oracleData?.LIAB_CONTRACT) !== "";

  const isCardContract =
    (contract.oracleData?.CARD_NUMBER &&
      contract.oracleData?.CARD_NUMBER.length === 16 &&
      contract.oracleData?.CARD_NUMBER.startsWith("10000")) ||
    (contract.oracleData?.CONTRACT_NUMBER &&
      contract.oracleData?.CONTRACT_NUMBER.length === 16 &&
      contract.oracleData?.CONTRACT_NUMBER.startsWith("10000"));

  // State cho modal portal
  const [isBrowserReady, setIsBrowserReady] = useState(false);

  // Kiểm tra môi trường
  useEffect(() => {
    setIsBrowserReady(true);
  }, []);

  // Animation effect khi contract thay đổi
  useEffect(() => {
    setAnimateIn(false);
    setShowFullDetails(false);
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [contract.id]);

  // Lưu trạng thái vào localStorage khi lockedContracts thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "lockedContracts",
          JSON.stringify(lockedContracts)
        );
      } catch (error) {
        console.error("Error saving locked contracts state:", error);
      }
    }
  }, [lockedContracts]);

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

  const colors = getColorScheme(
    isIssueContract ? "issue" : isCardContract ? "card" : "liability"
  );

  // Hàm để toggle chế độ nhập mã
  const toggleCodeInput = () => {
    setShowCodeInput(true);
    setCodeInput("");
    setErrorMessage("");
    // Focus vào input
    setTimeout(() => {
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }, 100);
  };

  // Xử lý thay đổi input mã số
  const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    if (/^\d*$/.test(value) && value.length <= 6) {
      setCodeInput(value);
      setErrorMessage("");
    }
  };

  // Xử lý khi nhấn nút Submit
  const handleSubmitCode = () => {
    if (codeInput.length < 6) {
      setErrorMessage("Please enter all 6 digits");
      return;
    }

    if (codeInput === VERIFICATION_CODE) {
      // Mã đúng - mở khóa contract
      setLockedContracts((prev) => {
        const newState = { ...prev };
        delete newState[contract.id];
        return newState;
      });

      // Cập nhật state shared
      delete lockedContractsState[contract.id];

      // Reset state
      setShowCodeInput(false);
      setCodeInput("");
      setErrorMessage("");

      // Hiển thị toast thông báo thành công
      dispatch(
        showToast({
          message: `Successfully unlocked contract ${
            contract.oracleData?.CONTRACT_NUMBER || contract.id
          }!`,
          type: "success",
          duration: 3000,
        })
      );
    } else {
      // Mã sai
      setErrorMessage("Invalid verification code. Please try again.");

      // Hiển thị toast thông báo lỗi
      dispatch(
        showToast({
          message: "The verification code is incorrect. Please try again!",
          type: "error",
          duration: 3000,
        })
      );
    }
  };

  // Xử lý khi nhấn nút Cancel
  const handleCancelCode = () => {
    setShowCodeInput(false);
    setCodeInput("");
    setErrorMessage("");
  };

  // Hàm để toggle trạng thái lock
  const toggleLockStatus = () => {
    if (isLocked) {
      // Nếu đang bị khóa, hiển thị màn hình nhập mã
      toggleCodeInput();
    } else {
      // Nếu đang mở, khóa lại ngay lập tức
      const newIsLocked = true;
      console.log("Locking contract:", contract.id);

      // Cập nhật state lockedContracts
      setLockedContracts((prev) => {
        const newState = { ...prev };
        newState[contract.id] = true;
        return newState;
      });

      // Cập nhật state shared
      lockedContractsState[contract.id] = true;

      // Hiển thị toast thông báo đã khóa
      dispatch(
        showToast({
          message: `Contract ${
            contract.oracleData?.CONTRACT_NUMBER || contract.id
          } has been locked!`,
          type: "info",
          duration: 3000,
        })
      );
    }
  };

  // Thêm useEffect để log khi state thay đổi
  useEffect(() => {
    console.log("isLocked state changed to:", isLocked);
  }, [isLocked]);

  // Thêm useEffect để kích hoạt hiệu ứng khi isLocked thay đổi
  useEffect(() => {
    setAnimateIcon(true);
    const timer = setTimeout(() => setAnimateIcon(false), 1000);
    return () => clearTimeout(timer);
  }, [isLocked]);

  // Hàm để xử lý khi nhấn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Khi nhấn Enter, tiến hành xác thực nếu đã nhập đủ 6 số
      if (codeInput.length === 6) {
        handleSubmitCode();
      }
    }
  };

  // Render modal xác thực mã số
  const renderVerificationModal = () => {
    if (!showCodeInput) return null;

    return (
      <Modal
        isOpen={showCodeInput}
        onClose={handleCancelCode}
        title="Enter the damn code, bro. (Hint: 123456 🤡)"
        maxWidth="max-w-[480px]"
      >
        <div className="space-y-6">
          {/* Input ẩn để nhận input */}
          <input
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={codeInput}
            onChange={handleCodeInputChange}
            onKeyDown={handleKeyDown}
            className="opacity-0 absolute pointer-events-auto w-px h-px"
            autoFocus
            aria-label="Verification code input"
          />

          {/* Hiển thị các ô số */}
          <div className="flex justify-between gap-2">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  onClick={() => codeInputRef.current?.focus()}
                  className={`w-12 h-16 flex items-center justify-center rounded-lg text-2xl font-bold border-2 shadow-sm
                ${
                  codeInput.length === index
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-300 dark:border-gray-600"
                } 
                ${
                  index < codeInput.length
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800"
                } 
                transition-all duration-200 cursor-text`}
                >
                  {index < codeInput.length ? codeInput[index] : ""}
                </div>
              ))}
          </div>

          {/* Hiển thị thông báo lỗi */}
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmitCode}
              variant="primary"
              type="button"
              icon={RiCheckLine}
              className="min-w-[120px]"
            >
              Verify Code
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/30 bg-white dark:bg-gray-800/90 transition-all duration-300 h-[750px] flex flex-col relative">
      {/* Inject custom animation styles */}
      <style jsx>{animationStyles}</style>

      <div className="p-4 flex flex-col overflow-hidden h-full">
        {/* Header with animation - Giảm padding và kích thước */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between mb-4 transition-all duration-500 ease-out ${
            animateIn
              ? "opacity-100 transform-none"
              : "opacity-0 -translate-y-4"
          } rounded-xl p-4 shadow-lg relative overflow-hidden
          ${colors.bg}
          `}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-white/10 rounded-full blur-lg"></div>

          {/* Contract circle icon with ripple effect - Tăng kích thước */}
          <div className="relative z-10 flex items-start md:items-center mb-2 md:mb-0">
            <div className="relative flex-shrink-0">
              <div
                className={`p-2.5 rounded-xl mr-3 shadow-md bg-white/20 backdrop-blur-sm transform transition-transform hover:scale-110 duration-300`}
              >
                {isIssueContract ? (
                  <RiExchangeFundsLine className="w-6 h-6 text-white" />
                ) : isCardContract ? (
                  <RiIdCardLine className="w-6 h-6 text-white" />
                ) : (
                  <RiFileTextLine className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                {contract.oracleData?.CONTRACT_NAME || contract.title}
              </h2>
              <div className="flex items-center text-sm text-white/80 mt-0.5">
                <span className="mr-2 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-white/80 mr-1 animate-pulse"></span>
                  {getContractTypeTitle()}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-sm">
                  {contract.oracleData?.CONTRACT_NUMBER || "No number"}
                </span>
              </div>
            </div>
          </div>

          {/* Thay thế phần decorative pattern bằng Lock/Available image */}
          <div className="hidden md:flex flex-col items-center relative z-10">
            <div className="hidden md:flex flex-col items-center relative z-10">
              <button
                onClick={toggleLockStatus}
                className="transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="relative w-15 h-15 flex items-center justify-center overflow-hidden">
                  {isLocked ? (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Image
                        src={`/locked.png?v=${Date.now()}`}
                        alt="Locked"
                        width={45}
                        height={45}
                        className="opacity-90 rounded-full"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Image
                        src={`/unlock.png?v=${Date.now()}`}
                        alt="Available"
                        width={45}
                        height={45}
                        priority
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full animate-ping-slow"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar relative">
          <div
            className={`space-y-4 transition-all duration-500 ease-out ${
              animateIn
                ? "opacity-100 transform-none"
                : "opacity-0 translate-y-4"
            } ${isLocked ? "blur-sm opacity-60 pointer-events-none" : ""}`}
          >
            {/* Main Contract Information */}
            <div
              className={`overflow-hidden rounded-xl shadow-lg border ${colors.cardBorder}`}
            >
              {/* Header - Giảm padding */}
              <div
                className={`px-4 py-3 ${colors.bg} relative overflow-hidden rounded-t-xl shadow-md`}
              >
                {/* Trang trí */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6 blur-xl"></div>

                <h3
                  className={`text-lg font-semibold text-white flex items-center relative z-10`}
                >
                  <div
                    className={`p-2 rounded-lg mr-2 bg-white/20 backdrop-blur-sm`}
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

              {/* Contract Info - Tăng padding và kích thước */}
              <div
                className={`p-4 rounded-b-xl border-x border-b ${colors.cardBorder} ${colors.cardBg} hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Contract ID */}
                  <InfoCard
                    icon={RiHashtag}
                    label="Contract ID"
                    value={contract.oracleData?.ID || contract.id}
                    colors={colors}
                  />

                  {/* Contract Name */}
                  <InfoCard
                    icon={RiFileUserLine}
                    label="Contract Name"
                    value={contract.oracleData?.CONTRACT_NAME}
                    colors={colors}
                  />

                  {/* Contract Number */}
                  <InfoCard
                    icon={RiFileTextLine}
                    label="Contract Number"
                    value={contract.oracleData?.CONTRACT_NUMBER}
                    colors={colors}
                  />

                  {/* Branch */}
                  <InfoCard
                    icon={RiBankLine}
                    label="Branch"
                    value={contract.oracleData?.BRANCH}
                    colors={colors}
                  />

                  {/* Client ID with Link */}
                  <InfoCard
                    icon={RiUser3Line}
                    label="Client ID"
                    value={contract.oracleData?.CLIENT__ID}
                    colors={colors}
                    link={
                      contract.oracleData?.CLIENT__ID
                        ? {
                            href: `/clients/${contract.oracleData.CLIENT__ID}`,
                            text: "View Client Details",
                          }
                        : undefined
                    }
                  />

                  {/* Amendment Date */}
                  <InfoCard
                    icon={RiCalendarLine}
                    label="Amendment Date"
                    value={formatDate(contract.oracleData?.AMND_DATE)}
                    colors={colors}
                  />
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
                  <div className="absolute inset-0 bg-white/10 blur-md opacity-0"></div>

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

            {/* Additional Details - Thu nhỏ lại */}
            <div className="mt-3">
              {/* Additional Details Header */}
              <div
                className={`px-4 py-3 ${colors.bg} relative overflow-hidden rounded-t-xl shadow-md`}
              >
                {/* Trang trí */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6 blur-xl"></div>

                <h3
                  className={`text-lg font-semibold text-white flex items-center relative z-10`}
                >
                  <div
                    className={`p-2 rounded-lg mr-2 bg-white/20 backdrop-blur-sm`}
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
                        <table className="w-full text-sm">
                          <tbody>
                            {Object.entries(contract?.oracleData || {})
                              .slice(0, 7)
                              .map(([key, value]) => (
                                <tr
                                  key={key}
                                  className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                                >
                                  <td
                                    className={`px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 w-1/3 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight} text-sm`}
                                  >
                                    {key}
                                  </td>
                                  <td className="px-3 py-2.5 text-gray-800 dark:text-gray-200 text-sm">
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
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
                    </div>
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => setShowFullDetails(true)}
                        className={`px-3 py-1.5 rounded-lg ${colors.bg} text-white text-xs hover:shadow-md transition-all duration-300`}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <tbody>
                          {Object.entries(contract?.oracleData || {}).map(
                            ([key, value]) => (
                              <tr
                                key={key}
                                className={`border-b ${colors.borderLight} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                              >
                                <td
                                  className={`px-3 py-2 bg-gray-50 dark:bg-gray-700/50 w-1/3 font-medium text-gray-700 dark:text-gray-300 border-r ${colors.borderLight} text-xs`}
                                >
                                  {key}
                                </td>
                                <td className="px-3 py-2 text-gray-800 dark:text-gray-200 text-xs">
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
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => setShowFullDetails(false)}
                        className={`px-3 py-1.5 rounded-lg ${colors.bg} text-white text-xs hover:shadow-md transition-all duration-300`}
                      >
                        Less Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lớp phủ khi nội dung bị khóa - Được đặt ở cấp cao nhất của component */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 pt-20">
          <div className="sticky top-1/4 w-full flex justify-center">
            <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-xl max-w-md text-center transform transition-all duration-300 border-2 border-red-500/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Image
                  src="/locked.png"
                  alt="Locked"
                  width={40}
                  height={40}
                  className="opacity-90"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Content Locked
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This contract has been locked and cannot be edited. Click the
                button below to unlock it with a verification code.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCodeInput();
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Unlock Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render các modal */}
      {isBrowserReady &&
        showCodeInput &&
        createPortal(renderVerificationModal(), document.body)}

      {showCardModal && (
        <CreditCardModal
          contract={contract}
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
        />
      )}
    </div>
  );
}
