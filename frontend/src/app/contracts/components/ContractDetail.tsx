'use client';

import { useState, useEffect } from 'react';
import { RiFileTextLine, RiUserLine, RiCalendarLine, RiMoneyDollarCircleLine, RiEditLine, RiBuilding4Line, RiBarChartBoxLine, RiExchangeFundsLine, RiLockLine, RiLockUnlockLine, RiCheckLine, RiCloseLine, RiPencilLine, RiSaveLine } from 'react-icons/ri';
import clsx from 'clsx';
import Link from 'next/link';
import { ContractNode } from '../types';
import Button from '@/components/ui/Button';
import Modal from '@/components/Modal';
import Input from '@/components/ui/Input';

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [isLocked, setIsLocked] = useState(contract.status !== 'active');
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editedContract, setEditedContract] = useState<ContractNode>(contract);
  
  // Animation effect when contract changes
  useEffect(() => {
    setAnimateIn(false);
    setIsLocked(contract.status !== 'active');
    setIsEditing(false);
    setEditedContract(contract);
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [contract.id, contract.status]);

  // Toggle lock status
  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      setIsEditing(false);
    }
    // Ở đây bạn sẽ gọi API để cập nhật trạng thái của hợp đồng
    // Hiện tại, chúng ta chỉ thay đổi trạng thái UI
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (!isLocked) {
      setIsEditing(!isEditing);
      if (isEditing) {
        // Nếu đang tắt chế độ edit, hiển thị modal xác nhận
        setIsConfirmModalOpen(true);
      }
    }
  };

  // Save changes
  const saveChanges = () => {
    // Ở đây bạn sẽ gọi API để lưu thay đổi
    // Hiện tại, chúng ta chỉ cập nhật UI
    setIsConfirmModalOpen(false);
    setIsEditing(false);
    // Thông báo thành công (có thể thêm toast notification)
  };

  // Cancel changes
  const cancelChanges = () => {
    setEditedContract(contract);
    setIsConfirmModalOpen(false);
    setIsEditing(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get contract type icon
  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'liability':
        return <RiFileTextLine className="w-5 h-5" />;
      case 'issuing':
        return <RiExchangeFundsLine className="w-5 h-5" />;
      case 'card':
        return <RiMoneyDollarCircleLine className="w-5 h-5" />;
      default:
        return <RiFileTextLine className="w-5 h-5" />;
    }
  };

  // Editable field component
  const EditableField = ({ section, field, value, label }: { section: string, field: string, value: any, label: string }) => {
    return (
      <div className="relative group">
        {isEditing ? (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <Input
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                const newContract = JSON.parse(JSON.stringify(editedContract));
                
                if (section === 'segment' && newContract.segment) {
                  newContract.segment[field] = newValue;
                } else if (section === 'liability' && newContract.liability) {
                  newContract.liability[field] = newValue;
                } else if (section === 'financial' && newContract.financial) {
                  newContract.financial[field] = field === 'currency' ? newValue : parseFloat(newValue) || 0;
                } else if (section === 'cardDetails' && newContract.cardDetails) {
                  newContract.cardDetails[field] = newValue;
                }
                
                setEditedContract(newContract);
              }}
              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
            />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {!isLocked && (
              <button 
                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => setIsEditing(true)}
              >
                <RiPencilLine className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-auto md:h-[calc(100vh-180px)]">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-40 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="p-6 h-full flex flex-col overflow-hidden">
        {/* Header with animation - Modified to reduce text and button size */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-start md:items-center mb-4 md:mb-0">
            <div className={`p-2 rounded-xl mr-3 shadow-md ${
              contract.type === 'liability' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
              contract.type === 'issuing' ? 'bg-purple-100 dark:bg-purple-900/30' :
              'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              {getContractTypeIcon(contract.type)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{contract.title}</h2>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="mr-2">{contract.type.charAt(0).toUpperCase() + contract.type.slice(1)} Contract</span>
              </div>
            </div>
          </div>
          
          {/* Modified buttons to be smaller */}
          <div className="flex flex-wrap gap-2 md:flex-nowrap">
            <Button
              variant="secondary"
              className={`transition-all duration-300 hover:shadow-md min-w-[90px] md:min-w-[100px] text-sm py-1.5 px-2 md:px-3 ${
                isLocked 
                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50' 
                  : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50'
              }`}
              icon={isLocked ? RiLockLine : RiLockUnlockLine}
              onClick={toggleLock}
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </Button>
            
            <Button
              variant="primary"
              className={`transition-all duration-300 hover:shadow-md min-w-[90px] md:min-w-[100px] text-sm py-1.5 px-2 md:px-3 ${
                isLocked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              icon={isEditing ? RiSaveLine : RiEditLine}
              onClick={toggleEdit}
              disabled={isLocked}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </Button>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div className={`space-y-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
            {/* Content based on contract type */}
            {contract.type === 'liability' && editedContract.segment && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                {/* Enhanced SEGMENT section */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                    <RiBuilding4Line className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-lg">SEGMENT</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Institution</p>
                          <Input
                            value={editedContract.segment?.institution || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.institution = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Institution</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.institution || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch</p>
                          <Input
                            value={editedContract.segment?.branch || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.branch = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.branch || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product</p>
                          <Input
                            value={editedContract.segment?.product || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.product = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.product || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Service Group</p>
                          <Input
                            value={editedContract.segment?.serviceGroup || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.serviceGroup = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Service Group</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.serviceGroup || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Report Type</p>
                          <Input
                            value={editedContract.segment?.reportType || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.reportType = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Report Type</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.reportType || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="group">
                      {isEditing ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                          <Input
                            value={editedContract.segment?.role || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const newContract = JSON.parse(JSON.stringify(editedContract));
                              if (newContract.segment) {
                                newContract.segment.role = newValue;
                                setEditedContract(newContract);
                              }
                            }}
                            className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                          <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.role || ''}</p>
                          {!isLocked && (
                            <button 
                              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsEditing(true)}
                            >
                              <RiPencilLine className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {editedContract.liability && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                        <RiFileTextLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="bg-purple-50 dark:bg-purple-900/50 px-3 py-1 rounded-lg">LIABILITY</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Category</p>
                              <Input
                                value={editedContract.liability?.category || ''}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.liability) {
                                    newContract.liability.category = newValue;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Category</p>
                              <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.category || ''}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Contract</p>
                              <Input
                                value={editedContract.liability?.contractNumber || ''}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.liability) {
                                    newContract.liability.contractNumber = newValue;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Contract</p>
                              <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.contractNumber || ''}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Client</p>
                              <Input
                                value={editedContract.liability?.client || ''}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.liability) {
                                    newContract.liability.client = newValue;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Client</p>
                              <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.client || ''}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {editedContract.financial && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
                        <RiBarChartBoxLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 rounded-lg">FINANCIALS</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Currency</p>
                              <Input
                                value={editedContract.financial?.currency || "VND"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.currency = newValue;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Currency</p>
                              <p className="font-medium text-gray-900 dark:text-white">{editedContract.financial?.currency || "VND"}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available</p>
                              <Input
                                value={editedContract.financial?.available.toString() || "0"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.available = parseFloat(newValue) || 0;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Available</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.available || 0)}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                              <Input
                                value={editedContract.financial?.balance.toString() || "0"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.balance = parseFloat(newValue) || 0;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Balance</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.balance || 0)}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Credit Limit</p>
                              <Input
                                value={editedContract.financial?.creditLimit?.toString() || "0"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.creditLimit = parseFloat(newValue) || 0;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Credit Limit</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.creditLimit || 0)}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Additional Limit</p>
                              <Input
                                value={editedContract.financial?.additionalLimit?.toString() || "0"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.additionalLimit = parseFloat(newValue) || 0;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Additional Limit</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.additionalLimit || 0)}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div className="group">
                          {isEditing ? (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Blocked</p>
                              <Input
                                value={editedContract.financial?.blocked?.toString() || "0"}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const newContract = JSON.parse(JSON.stringify(editedContract));
                                  if (newContract.financial) {
                                    newContract.financial.blocked = parseFloat(newValue) || 0;
                                    setEditedContract(newContract);
                                  }
                                }}
                                className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Blocked</p>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.blocked || 0)}</p>
                              {!isLocked && (
                                <button 
                                  className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <RiPencilLine className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {contract.children && contract.children.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                      Related Issuing Contracts ({contract.children.length})
                    </h4>
                    <div className="space-y-3">
                      {contract.children.map(child => (
                        <div key={child.id} className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                                <RiExchangeFundsLine className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{child.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(child.startDate)} - {formatDate(child.endDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(child.value)}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-lg ${getStatusColor(child.status)}`}>
                                {child.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {contract.type === 'issuing' && contract.financial && (
              <div className="space-y-6">
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                      <RiBuilding4Line className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    SEGMENT
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Institution</p>
                            <Input
                              value={editedContract.segment?.institution || "Nam A Bank"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.institution = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Institution</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.institution || "Nam A Bank"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch</p>
                            <Input
                              value={editedContract.segment?.branch || "Hoi so Nam A"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.branch = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Branch</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.branch || "Hoi so Nam A"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product</p>
                            <Input
                              value={editedContract.segment?.product || "MasterCard EMV"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.product = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Product</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.product || "MasterCard EMV"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Service Group</p>
                            <Input
                              value={editedContract.segment?.serviceGroup || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.serviceGroup = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Service Group</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.serviceGroup || ""}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Report Type</p>
                            <Input
                              value={editedContract.segment?.reportType || "Cardholder Default"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.reportType = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Report Type</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.reportType || "Cardholder Default"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                            <Input
                              value={editedContract.segment?.role || "Full Liability"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.segment) {
                                  newContract.segment.role = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Role</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.segment?.role || "Full Liability"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                      <RiFileTextLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="bg-purple-50 dark:bg-purple-900/50 px-3 py-1 rounded-lg">LIABILITY</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Category</p>
                            <Input
                              value={editedContract.liability?.category || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.liability) {
                                  newContract.liability.category = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Category</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.category || ''}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Contract</p>
                            <Input
                              value={editedContract.liability?.contractNumber || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.liability) {
                                  newContract.liability.contractNumber = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Contract</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.contractNumber || ''}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Client</p>
                            <Input
                              value={editedContract.liability?.client || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.liability) {
                                  newContract.liability.client = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Liability Client</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.liability?.client || ''}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
                      <RiBarChartBoxLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 rounded-lg">FINANCIALS</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Currency</p>
                            <Input
                              value={editedContract.financial?.currency || "VND"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.currency = newValue;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Currency</p>
                            <p className="font-medium text-gray-900 dark:text-white">{editedContract.financial?.currency || "VND"}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available</p>
                            <Input
                              value={editedContract.financial?.available.toString() || "0"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.available = parseFloat(newValue) || 0;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              type="number"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Available</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.available || 0)}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                            <Input
                              value={editedContract.financial?.balance.toString() || "0"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.balance = parseFloat(newValue) || 0;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              type="number"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Balance</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.balance || 0)}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Credit Limit</p>
                            <Input
                              value={editedContract.financial?.creditLimit?.toString() || "0"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.creditLimit = parseFloat(newValue) || 0;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              type="number"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Credit Limit</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.creditLimit || 0)}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Additional Limit</p>
                            <Input
                              value={editedContract.financial?.additionalLimit?.toString() || "0"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.additionalLimit = parseFloat(newValue) || 0;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              type="number"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Additional Limit</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.additionalLimit || 0)}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <div className="group">
                        {isEditing ? (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Blocked</p>
                            <Input
                              value={editedContract.financial?.blocked?.toString() || "0"}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                const newContract = JSON.parse(JSON.stringify(editedContract));
                                if (newContract.financial) {
                                  newContract.financial.blocked = parseFloat(newValue) || 0;
                                  setEditedContract(newContract);
                                }
                              }}
                              className="py-1 px-2 w-full bg-white/90 dark:bg-gray-700/90 border-purple-300 dark:border-purple-700 text-sm"
                              type="number"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Blocked</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(editedContract.financial?.blocked || 0)}</p>
                            {!isLocked && (
                              <button 
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => setIsEditing(true)}
                              >
                                <RiPencilLine className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {contract.children && contract.children.length > 0 && (
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Thẻ ({contract.children.length})
                    </h3>
                    <div className="space-y-3">
                      {contract.children.map(transaction => (
                        <div key={transaction.id} className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
                                <RiMoneyDollarCircleLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(transaction.startDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.value)}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-lg ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {contract.type === 'card' && contract.cardDetails && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
                    <RiMoneyDollarCircleLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Chi tiết thẻ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Loại</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contract.cardDetails.type}</p>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-sm text-gray-500 dark:text-emerald-300/70 mb-1">Hợp đồng phát hành</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contract.cardDetails.issueContract}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">Tóm tắt thẻ</h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 dark:text-gray-400">Ngày phát hành</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(contract.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 dark:text-gray-400">ID thẻ</span>
                      <span className="font-medium text-gray-900 dark:text-white">{contract.id}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 dark:text-gray-400">Số tiền</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(contract.value)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Trạng thái</span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={cancelChanges}
        title="Save Changes"
        maxWidth="max-w-md"
      >
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to save these changes?
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={cancelChanges}
              className="px-4 py-2"
              icon={RiCloseLine}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={saveChanges}
              className="px-4 py-2"
              icon={RiCheckLine}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

