import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  RiAddLine, 
  RiInformationLine, 
  RiFileTextLine, 
  RiUserSearchLine,
  RiExchangeFundsLine, 
  RiMoneyDollarCircleLine,
  RiArrowRightLine
} from 'react-icons/ri';
import { useAppDispatch } from '@/redux/hooks';
import { addContract } from '@/redux/slices/contractSlice';
import { ContractNode } from '../types';
import CardForm from './CardForm';
import IssuingContractForm from './IssuingContractForm';

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoapContractData {
  clientSearchMethod: string;
  clientIdentifier: string;
  reason: string;
  branch: string;
  institutionCode: string;
  productCode: string;
  productCode2: string;
  productCode3: string;
  contractName: string;
  cbsNumber: string;
  sessionContext?: string;
  correlationId?: string;
}

// Định nghĩa các loại hợp đồng
type ContractType = 'liability' | 'issuing' | 'card';

export default function AddContractModal({ 
  isOpen, 
  onClose
}: AddContractModalProps) {
  const dispatch = useAppDispatch();
  
  // State để lưu loại hợp đồng được chọn
  const [selectedContractType, setSelectedContractType] = useState<ContractType | null>(null);
  
  const [soapContractData, setSoapContractData] = useState<SoapContractData>({
    clientSearchMethod: 'CLIENT_NUMBER',
    clientIdentifier: '',
    reason: '',
    branch: '',
    institutionCode: '',
    productCode: '',
    productCode2: '',
    productCode3: '',
    contractName: 'Liability Contract',
    cbsNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSoapDataChange = (field: keyof SoapContractData, value: string) => {
    setSoapContractData(prev => ({ ...prev, [field]: value }));
  };

  const createNewContract = (): ContractNode => {
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(now.getFullYear() + 2);
    
    return {
      id: `L${Math.floor(Math.random() * 10000)}`,
      title: soapContractData.contractName,
      type: 'liability',
      status: 'active',
      startDate: now.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      value: 0,
      segment: {
        institution: soapContractData.institutionCode,
        branch: soapContractData.branch,
        product: soapContractData.productCode,
        serviceGroup: '',
        reportType: 'Cardholder Default',
        role: 'Full Liability'
      },
      liability: {
        category: 'Full Liability',
        contractNumber: soapContractData.cbsNumber || `001-L-${Math.floor(Math.random() * 100000)}`,
        client: soapContractData.clientIdentifier
      },
      financial: {
        currency: 'VND',
        available: 0,
        balance: 0,
        creditLimit: 0,
        additionalLimit: 0,
        blocked: 0
      },
      children: []
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      console.log('Sending data to backend:', soapContractData);

      const response = await axios.post('http://localhost:5000/api/createContract', soapContractData);
      
      console.log('Response from backend:', response.data);
      
      if (response.data.success) {
        setResponse("Tạo hợp đồng thành công!");
        toast.success('Tạo hợp đồng thành công!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            padding: '16px'
          },
        });
        
        const newContract = createNewContract();
        dispatch(addContract(newContract));
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorMessage = `Lỗi (${response.data.retCode}): ${response.data.message}`;
        setResponse(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '16px',
            padding: '16px'
          },
        });
      }

    } catch (error: any) {
      console.error('Error:', error);
      
      const errorMessage = error.response?.data?.message || 'Không thể kết nối đến server';
      setResponse(`Lỗi: ${errorMessage}`);
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          padding: '16px'
        },
      });
    
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedContractType(null);
      setSoapContractData({
        clientSearchMethod: 'CLIENT_NUMBER',
        clientIdentifier: '',
        reason: 'to test',
        branch: '9999',
        institutionCode: '9999',
        productCode: 'TEST',
        productCode2: '',
        productCode3: '',
        contractName: 'Liability Contract',
        cbsNumber: '',
      });
      setResponse(null);
    }
  }, [isOpen]);

  // Render màn hình chọn loại hợp đồng
  const renderContractTypeSelection = () => {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Chọn loại hợp đồng
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Liability Contract Option */}
          <div 
            className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-indigo-900/30 
              rounded-2xl shadow-lg border-2 border-indigo-200/60 dark:border-indigo-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            onClick={() => setSelectedContractType('liability')}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4">
                <RiFileTextLine className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Liability Contract</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Hợp đồng trách nhiệm cấp cao nhất
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  icon={RiArrowRightLine}
                  onClick={() => setSelectedContractType('liability')}
                >
                  Chọn
                </Button>
              </div>
            </div>
          </div>
          
          {/* Issuing Contract Option */}
          <div 
            className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-900/30 
              rounded-2xl shadow-lg border-2 border-purple-200/60 dark:border-purple-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
            onClick={() => setSelectedContractType('issuing')}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                <RiExchangeFundsLine className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Issuing Contract</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Hợp đồng phát hành thuộc Liability Contract
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                  icon={RiArrowRightLine}
                  onClick={() => setSelectedContractType('issuing')}
                >
                  Chọn
                </Button>
              </div>
            </div>
          </div>
          
          {/* Card Option */}
          <div 
            className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 
              rounded-2xl shadow-lg border-2 border-emerald-200/60 dark:border-emerald-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer opacity-70 hover:opacity-100"
            onClick={() => setSelectedContractType('card')}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full mb-4">
                <RiMoneyDollarCircleLine className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Card</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Thẻ thuộc Issuing Contract
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  icon={RiArrowRightLine}
                  onClick={() => setSelectedContractType('card')}
                >
                  Chọn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render form tạo Liability Contract
  const renderLiabilityContractForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
        
        {/* Contract Type Header */}
        <div className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-indigo-900/30 
          rounded-2xl shadow-xl border-2 border-indigo-200/60 dark:border-indigo-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileTextLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Liability Contract</h3>
            <button 
              type="button"
              className="ml-auto text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setSelectedContractType(null)}
            >
              Thay đổi
            </button>
          </div>
        </div>
        
        {/* Client Search Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiUserSearchLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Client Search Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Select
                  label="Client Search Method*"
                  value={soapContractData.clientSearchMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSoapDataChange('clientSearchMethod', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  required
                >
                  <option value="CLIENT_NUMBER">CLIENT_NUMBER</option>
                  <option value="CLIENT_ID">CLIENT_ID</option>
                  <option value="IDENTITY_CARD">IDENTITY_CARD</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Client Identifier*"
                  value={soapContractData.clientIdentifier}
                  onChange={(e) => handleSoapDataChange('clientIdentifier', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Reason"
                value={soapContractData.reason}
                onChange={(e) => handleSoapDataChange('reason', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileTextLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Contract Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Branch*"
                value={soapContractData.branch}
                onChange={(e) => handleSoapDataChange('branch', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Institution Code*"
                value={soapContractData.institutionCode}
                onChange={(e) => handleSoapDataChange('institutionCode', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Contract Name*"
                value={soapContractData.contractName}
                onChange={(e) => handleSoapDataChange('contractName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Product Code*"
                value={soapContractData.productCode}
                onChange={(e) => handleSoapDataChange('productCode', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Product Code 2"
                value={soapContractData.productCode2}
                onChange={(e) => handleSoapDataChange('productCode2', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Product Code 3"
                value={soapContractData.productCode3}
                onChange={(e) => handleSoapDataChange('productCode3', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Input
                label="CBS Number"
                value={soapContractData.cbsNumber}
                onChange={(e) => handleSoapDataChange('cbsNumber', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiInformationLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Kết quả</h3>
            </div>
            <div className="p-6">
              <div className={`p-4 rounded-xl text-center text-lg font-medium shadow-inner ${
                response.includes("Lỗi") 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              }`}>
                {response}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={onClose}
            variant="secondary"
            className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={RiAddLine}
            disabled={isSubmitting}
            className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
          >
            {isSubmitting ? 'Processing...' : 'Add contract'}
          </Button>
        </div>
      </form>
    );
  };

  // Render form tạo Issuing Contract
  const renderIssuingContractForm = () => {
    return (
      <IssuingContractForm 
        onBack={() => setSelectedContractType(null)} 
        onClose={onClose} 
      />
    );
  };

  // Render form tạo Card
  const renderCardForm = () => {
    return (
      <CardForm 
        onBack={() => setSelectedContractType(null)} 
        onClose={onClose} 
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      title={
        selectedContractType === null
          ? "Thêm hợp đồng mới"
          : selectedContractType === 'liability'
          ? "Tạo Liability Contract"
          : selectedContractType === 'issuing'
          ? "Tạo Issuing Contract"
          : "Tạo Card"
      }
    >
      {selectedContractType === null && renderContractTypeSelection()}
      {selectedContractType === 'liability' && renderLiabilityContractForm()}
      {selectedContractType === 'issuing' && renderIssuingContractForm()}
      {selectedContractType === 'card' && renderCardForm()}
    </Modal>
  );
} 