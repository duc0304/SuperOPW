'use client';

import { useState, useEffect } from 'react';
import { RiFileTextLine, RiCalendarLine, RiExchangeFundsLine, RiInformationLine, RiArrowRightSLine, RiIdCardLine, RiUser3Line, RiBankLine, RiHashtag, RiFileUserLine, RiCloseLine } from 'react-icons/ri';
import Link from 'next/link';
import { ContractNode } from '../types';
import { createPortal } from 'react-dom';

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Kiểm tra loại contract
  const isIssueContract = contract.oracleData?.LIAB_CONTRACT !== undefined && 
                          contract.oracleData?.LIAB_CONTRACT !== null && 
                          contract.oracleData?.LIAB_CONTRACT !== '';

  const isCardContract = (contract.oracleData?.CARD_NUMBER?.length === 16 && 
                         contract.oracleData?.CARD_NUMBER?.startsWith('10000')) || 
                         (contract.oracleData?.CONTRACT_NUMBER?.length === 16 && 
                         contract.oracleData?.CONTRACT_NUMBER?.startsWith('10000'));

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
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  // Get color scheme based on contract type
  const getColorScheme = () => {
    if (isIssueContract) {
      return {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        selectedBg: 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700/50', // Đồng bộ với ContractTree
        fieldBg: 'bg-purple-50/50 dark:bg-purple-900/20',
        fieldBorder: 'border-purple-100 dark:border-purple-800/30',
      };
    } else if (isCardContract) {
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
        selectedBg: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50', // Đồng bộ với ContractTree
        fieldBg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
        fieldBorder: 'border-emerald-100 dark:border-emerald-800/30',
      };
    } else {
      return {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        selectedBg: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50', // Đồng bộ với ContractTree
        fieldBg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
        fieldBorder: 'border-indigo-100 dark:border-indigo-800/30',
      };
    }
  };

  const colors = getColorScheme();

  // Hàm để render dữ liệu JSON dưới dạng danh sách key-value
  const renderJsonData = (data: any) => {
    if (!data) return <p className="text-gray-500 dark:text-gray-400">No additional data available.</p>;

    const entries = Object.entries(data);

    return (
      <ul className="space-y-2">
        {entries.map(([key, value]) => (
          <li key={key} className="flex items-start">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">{key}:</span>
            <span className="text-gray-600 dark:text-gray-400">
              {typeof value === 'object' && value !== null
                ? JSON.stringify(value).slice(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '')
                : value?.toString() || 'N/A'}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-auto md:h-[calc(100vh-180px)]">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="p-6 h-full flex flex-col overflow-hidden">
        {/* Header with animation - Sử dụng selectedBg để đồng bộ màu với ContractTree */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'} border-4 ${colors.fieldBorder} rounded-xl p-4 shadow-lg ${colors.selectedBg}`}>
          <div className="flex items-start md:items-center mb-4 md:mb-0">
            <div className={`p-2 rounded-xl mr-3 shadow-md ${colors.bg}`}>
              {isIssueContract ? (
                <RiExchangeFundsLine className={`w-5 h-5 ${colors.text}`} />
              ) : isCardContract ? (
                <RiIdCardLine className={`w-5 h-5 ${colors.text}`} />
              ) : (
                <RiFileTextLine className={`w-5 h-5 ${colors.text}`} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {contract.oracleData?.CONTRACT_NAME || contract.title}
              </h2>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="mr-2">{getContractTypeTitle()}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.badgeBg}`}>
                  {contract.oracleData?.CONTRACT_NUMBER || contract.liability?.contractNumber || 'No number'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div className={`space-y-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            
            {/* Main Contract Information */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                  {isIssueContract ? (
                    <RiExchangeFundsLine className={`w-5 h-5 ${colors.text}`} />
                  ) : isCardContract ? (
                    <RiIdCardLine className={`w-5 h-5 ${colors.text}`} />
                  ) : (
                    <RiFileTextLine className={`w-5 h-5 ${colors.text}`} />
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg ${colors.bg}`}>CONTRACT DETAILS</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract ID */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiHashtag className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract ID</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.oracleData?.ID || contract.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                    
                {/* Contract Name */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiFileUserLine className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.oracleData?.CONTRACT_NAME || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Contract Number */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiFileTextLine className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Number</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.oracleData?.CONTRACT_NUMBER || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Branch */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiBankLine className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.oracleData?.BRANCH || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                  
                {/* Client ID */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiUser3Line className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Client ID</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contract.oracleData?.CLIENT__ID || 'N/A'}
                      </p>
                      {contract.oracleData?.CLIENT__ID && (
                        <Link href={`/clients/${contract.oracleData.CLIENT__ID}`} className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:dark:text-indigo-300 transition-colors mt-1 inline-block">
                          View Client Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Amendment Date */}
                <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                      <RiCalendarLine className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amendment Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(contract.oracleData?.AMND_DATE)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Registration Info - Only show if it's a card contract */}
            {isCardContract && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                    <RiIdCardLine className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-lg ${colors.bg}`}>CARD REGISTRATION</span>
                </h3>
              
                {/* Thẻ vật lý */}
                <div className="mb-6">
                  <div 
                    className="relative w-full max-w-[425px] h-[270px] mx-auto rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group cursor-pointer"
                    onClick={() => setShowCardModal(true)}
                  >
                    {/* Nền thẻ */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: 'url(/card-bg.jpg)' }}
                    />
                    
                    {/* Hiệu ứng lớp phủ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Hiệu ứng phản chiếu nhẹ */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
                    
                    {/* Tên ngân hàng */}
                    <div className="absolute top-[25px] left-[30px]">
                      <p className="text-white font-bold text-2xl tracking-wider">HAICHANBANK</p>
                    </div>
                    
                    {/* Logo - phóng to */}
                    <div className="absolute top-[-5px] right-[20px]">
                      <img src="/mastercard.svg" alt="MasterCard" className="w-[90px] h-[90px]" />
                    </div>
                    
                    {/* Chip - phóng to */}
                    <div className="absolute top-[100px] left-[30px]">
                      <img src="/chip.png" alt="Card Chip" className="w-[60px] h-auto object-contain drop-shadow-md" />
                    </div>
                    
                    {/* Biểu tượng contactless - sử dụng hình ảnh */}
                    <div className="absolute top-[102px] left-[95px]">
                      <img src="/contactless-indicator.png" alt="Contactless" className="w-[35px] h-auto opacity-70" />
                    </div>
                    
                    {/* Số thẻ với font OCR-A */}
                    <div className="absolute top-[160px] left-[30px] right-[30px]">
                      <p className="font-['OCR-A'] text-[22px] text-white tracking-[0.15em] whitespace-nowrap overflow-hidden">
                        {contract.oracleData?.CARD_NUMBER ? 
                          contract.oracleData.CARD_NUMBER.replace(/(\d{4})/g, '$1 ').trim() : 
                          '1000 0101 3559 6630'}
                      </p>
                    </div>
                    
                    {/* Tên chủ thẻ */}
                    <div className="absolute bottom-[25px] left-[30px]">
                      <p className="text-xs text-white/80 uppercase tracking-wider mb-0.5">CARD HOLDER</p>
                      <p className="text-white uppercase font-medium text-sm">
                        {contract.oracleData?.TR_FIRST_NAM && contract.oracleData?.TR_LAST_NAM ? 
                          `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}` : 
                          'NAM DINH'}
                      </p>
                    </div>
                    
                    {/* Ngày hết hạn */}
                    <div className="absolute bottom-[25px] right-[30px] text-right">
                      <p className="text-xs text-white/80 uppercase tracking-wider mb-0.5">EXPIRES</p>
                      <p className="text-white font-medium text-sm">MM/YY</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                        <RiUser3Line className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">First Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {contract.oracleData?.TR_FIRST_NAM || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Last Name */}
                  <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                        <RiUser3Line className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {contract.oracleData?.TR_LAST_NAM || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Number - Only if present */}
                  {contract.oracleData?.CARD_NUMBER && (
                    <div className={`p-4 rounded-xl border ${colors.fieldBorder} ${colors.fieldBg}`}>
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
                          <RiIdCardLine className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Card Number</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {contract.oracleData?.CARD_NUMBER || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Additional Details with View More/View Less */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                    <RiInformationLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="bg-purple-50 dark:bg-purple-900/50 px-3 py-1 rounded-lg">ADDITIONAL DETAILS</span>
                </div>
                <button
                  onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:dark:text-indigo-300 transition-colors"
                >
                  {showAdditionalDetails ? 'View Less' : 'View More'}
                </button>
              </h3>
              
              {showAdditionalDetails && (
                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                  {/* Hiển thị dữ liệu JSON dưới dạng danh sách key-value */}
                  <div className="bg-purple-50/30 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/20">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">All Contract Data</p>
                    {renderJsonData(contract.oracleData)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Render modal with portal */}
      {isMounted && showCardModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setShowCardModal(false)}>
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
              style={{ backgroundImage: 'url(/card-bg.jpg)' }}
            />
            
            {/* Hiệu ứng lớp phủ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            {/* Hiệu ứng phản chiếu nhẹ */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
            
            {/* Tên ngân hàng */}
            <div className="absolute top-[8%] left-[5%]">
              <p className="text-white font-bold text-4xl md:text-6xl tracking-wider">HAICHANBANK</p>
            </div>
            
            {/* Logo - tăng kích thước */}
            <div className="absolute top-[-3%] right-[3%]">
              <img src="/mastercard.svg" alt="MasterCard" className="w-[200px] md:w-[200px] h-auto" />
            </div>
            
            {/* Chip - tăng kích thước */}
            <div className="absolute top-[38%] left-[5%]">
              <img src="/chip.png" alt="Card Chip" className="w-[150px] md:w-[150px] h-auto object-contain drop-shadow-md" />
            </div>
            
            {/* Biểu tượng contactless - tăng kích thước */}
            <div className="absolute top-[38%] left-[21%]">
              <img src="/contactless-indicator.png" alt="Contactless" className="w-[90px] md:w-[90px] h-auto opacity-80" />
            </div>
            
            {/* Số thẻ với font OCR-A */}
            <div className="absolute top-[60%] left-[5%] right-[5%]">
              <p className="font-['OCR-A'] text-[5vmin] md:text-[5vmin] text-white tracking-[0.15em] whitespace-nowrap overflow-hidden">
                {contract.oracleData?.CARD_NUMBER ? 
                  contract.oracleData.CARD_NUMBER.replace(/(\d{4})/g, '$1 ').trim() : 
                  '1000 0101 3559 6630'}
              </p>
            </div>
            
            {/* Tên chủ thẻ */}
            <div className="absolute bottom-[8%] left-[5%]">
              <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">CARD HOLDER</p>
              <p className="text-white uppercase font-medium text-2xl md:text-4xl">
                {contract.oracleData?.TR_FIRST_NAM && contract.oracleData?.TR_LAST_NAM ? 
                  `${contract.oracleData.TR_FIRST_NAM} ${contract.oracleData.TR_LAST_NAM}` : 
                  'NAM DINH'}
              </p>
            </div>
            
            {/* Ngày hết hạn */}
            <div className="absolute bottom-[8%] right-[5%] text-right">
              <p className="text-lg md:text-xl text-white/80 uppercase tracking-wider mb-2">EXPIRES</p>
              <p className="text-white font-medium text-2xl md:text-4xl">MM/YY</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}