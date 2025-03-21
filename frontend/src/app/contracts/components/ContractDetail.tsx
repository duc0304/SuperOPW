'use client';

import { useState, useEffect } from 'react';
import { RiFileTextLine, RiCalendarLine, RiExchangeFundsLine, RiInformationLine, RiArrowRightSLine, RiParentLine, RiIdCardLine, RiUser3Line, RiBankLine, RiHashtag, RiFileUserLine } from 'react-icons/ri';
import Link from 'next/link';
import { ContractNode } from '../types';

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [parentContract, setParentContract] = useState<any>(null);
  const [loadingParent, setLoadingParent] = useState(false);
  
  // Kiểm tra xem contract hiện tại có phải là Issuing contract không
  const isIssueContract = contract.oracleData?.LIAB_CONTRACT !== undefined && 
                          contract.oracleData?.LIAB_CONTRACT !== null && 
                          contract.oracleData?.LIAB_CONTRACT !== '';

  const isCardContract = (contract.oracleData?.CARD_NUMBER?.length === 16 && 
                         contract.oracleData?.CARD_NUMBER?.startsWith('10000')) || 
                         (contract.oracleData?.CONTRACT_NUMBER?.length === 16 && 
                         contract.oracleData?.CONTRACT_NUMBER?.startsWith('10000'));

  // Fetch parent contract data if this is an issuing contract
  useEffect(() => {
    const fetchParentContract = async () => {
      if (!isIssueContract) return;
      
      const parentId = contract.oracleData?.LIAB_CONTRACT;
      if (!parentId) return;
      
      setLoadingParent(true);
      try {
        // Fetch from Oracle API
        const response = await fetch(`http://localhost:5000/api/oracle/contracts/${parentId}`);
        if (!response.ok) throw new Error('Failed to fetch parent contract');
        
        const data = await response.json();
        if (data.success && data.data) {
          setParentContract(data.data);
        }
      } catch (error) {
        console.error('Error fetching parent contract:', error);
      } finally {
        setLoadingParent(false);
      }
    };
    
    fetchParentContract();
  }, [contract.oracleData?.LIAB_CONTRACT, isIssueContract]);

  // Animation effect when contract changes
  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [contract.id]);

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

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-auto md:h-[calc(100vh-180px)]">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="p-6 h-full flex flex-col overflow-hidden">
        {/* Header with animation */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-start md:items-center mb-4 md:mb-0">
            <div className={`p-2 rounded-xl mr-3 shadow-md ${
              isIssueContract 
                ? 'bg-purple-100 dark:bg-purple-900/30' 
                : isCardContract
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'bg-indigo-100 dark:bg-indigo-900/30'
            }`}>
              {isIssueContract ? (
                <RiExchangeFundsLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : isCardContract ? (
                <RiIdCardLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <RiFileTextLine className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {contract.oracleData?.CONTRACT_NAME || contract.title}
              </h2>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="mr-2">{getContractTypeTitle()}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isIssueContract 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                    : isCardContract
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                }`}>
                  {contract.oracleData?.CONTRACT_NUMBER || contract.liability?.contractNumber || 'No number'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div className={`space-y-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            
            {/* Parent Contract Information (Only for Issue contracts) */}
            {isIssueContract && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                    <RiParentLine className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-lg">PARENT LIABILITY CONTRACT</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {loadingParent ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                  ) : parentContract ? (
                    <div className="bg-indigo-50/30 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Parent Contract ID */}
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Contract ID</p>
                          <p className="font-medium text-gray-900 dark:text-white bg-white/60 dark:bg-gray-700/60 p-2 rounded-lg">
                            {parentContract.ID || contract.oracleData?.LIAB_CONTRACT || 'N/A'}
                          </p>
                        </div>
                        
                        {/* Parent Contract Number */}
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Contract Number</p>
                          <p className="font-medium text-gray-900 dark:text-white bg-white/60 dark:bg-gray-700/60 p-2 rounded-lg">
                            {parentContract.CONTRACT_NUMBER || 'N/A'}
                          </p>
                        </div>
                
                        {/* Parent Contract Name */}
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Contract Name</p>
                          <p className="font-medium text-gray-900 dark:text-white bg-white/60 dark:bg-gray-700/60 p-2 rounded-lg">
                            {parentContract.CONTRACT_NAME || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <Link href={`/contracts?id=${parentContract.ID}`} className="text-xs bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg inline-flex items-center transition-all duration-200">
                          <span>View Parent Contract</span>
                          <RiArrowRightSLine className="ml-1 w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/20">
                      <div className="flex items-center text-yellow-700 dark:text-yellow-400">
                        <RiInformationLine className="mr-2 w-5 h-5" />
                        <p>Parent contract information (ID: {contract.oracleData?.LIAB_CONTRACT}) could not be loaded.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
                
            {/* Main Contract Information */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  isIssueContract 
                    ? 'bg-purple-100 dark:bg-purple-900/30' 
                    : isCardContract
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-indigo-100 dark:bg-indigo-900/30'
                }`}>
                  {isIssueContract ? (
                    <RiExchangeFundsLine className={`w-5 h-5 text-purple-600 dark:text-purple-400`} />
                  ) : isCardContract ? (
                    <RiIdCardLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <RiFileTextLine className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg ${
                  isIssueContract 
                    ? 'bg-purple-50 dark:bg-purple-900/50' 
                    : isCardContract
                      ? 'bg-emerald-50 dark:bg-emerald-900/50'
                      : 'bg-indigo-50 dark:bg-indigo-900/50'
                }`}>CONTRACT DETAILS</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract ID */}
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiHashtag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiFileUserLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiFileTextLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiBankLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiUser3Line className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg mr-3">
                      <RiCalendarLine className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
                    <RiIdCardLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 rounded-lg">CARD REGISTRATION</span>
                </h3>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-start">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg mr-3">
                        <RiUser3Line className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-start">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg mr-3">
                        <RiUser3Line className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="flex items-start">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg mr-3">
                          <RiIdCardLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
            
            {/* Additional Details/Raw Data */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                  <RiInformationLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="bg-purple-50 dark:bg-purple-900/50 px-3 py-1 rounded-lg">ADDITIONAL DETAILS</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Raw JSON Data */}
                <div className="bg-purple-50/30 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/20">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">All Contract Data</p>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg overflow-x-auto max-h-40">
                    <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(contract.oracleData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

