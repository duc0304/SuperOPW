import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { RiAddLine, RiBuilding2Line, RiUser3Line, RiFileList2Line, RiInformationLine, RiSaveLine } from 'react-icons/ri';
import type { Client } from '@/redux/slices/clientSlice';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Omit<Client, 'id'>;
  setFormData: (data: Omit<Client, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface SoapClientData {
  institutionCode: string;
  branch: string;
  clientTypeCode: string;
  shortName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthDate: string;
  identityCardNumber: string;
  identityCardDetails: string;
  mobilePhone: string;
  email: string;
  addressLine1: string;
  city: string;
  salutationCode: string;
  maritalStatusCode: string;
  citizenship: string;
  clientNumber: string;
  companyName?: string;
  customData: Array<{
    addInfoType: string;
    tagName: string;
    tagValue: string;
  }>;
}

export default function AddClientModal({ 
  isOpen, 
  onClose,
  formData,
  setFormData,
  onSubmit
}: AddClientModalProps) {
  const [soapClientData, setSoapClientData] = useState<SoapClientData>({
    institutionCode: '9999',
    branch: '9999',
    clientTypeCode: 'PR',
    shortName: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'M',
    birthDate: '',
    identityCardNumber: '',
    identityCardDetails: '',
    mobilePhone: '',
    email: '',
    addressLine1: '',
    city: '',
    salutationCode: 'MR',
    maritalStatusCode: '',
    citizenship: 'VNM',
    clientNumber: '',
    customData: [
      { 
        addInfoType: 'AddInfo01', 
        tagName: 'DefaultTag', 
        tagValue: 'DefaultValue' 
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSoapDataChange = (field: keyof SoapClientData, value: string) => {
    setSoapClientData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomDataChange = (index: number, field: keyof typeof soapClientData.customData[0], value: string) => {
    const updatedCustomData = [...soapClientData.customData];
    updatedCustomData[index] = {
      ...updatedCustomData[index],
      [field]: value
    };
    
    setSoapClientData(prev => ({
      ...prev,
      customData: updatedCustomData
    }));
  };

  const addCustomData = () => {
    setSoapClientData(prev => ({
      ...prev,
      customData: [
        ...prev.customData,
        { addInfoType: 'AddInfo01', tagName: '', tagValue: '' }
      ]
    }));
  };

  const removeCustomData = (index: number) => {
    if (soapClientData.customData.length <= 1) return;
    
    const updatedCustomData = [...soapClientData.customData];
    updatedCustomData.splice(index, 1);
    
    setSoapClientData(prev => ({
      ...prev,
      customData: updatedCustomData
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      console.log('Sending data to backend:', soapClientData);

      const response = await axios.post('http://localhost:5000/api/soap/createClient', soapClientData);
      
      console.log('Response from backend:', response.data);
      
      // Kiểm tra success từ backend
      if (response.data.success) {
        // Thành công
        setResponse("Tạo khách hàng thành công!");
        toast.success('Tạo khách hàng thành công!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            padding: '16px'
          },
        });
      } else {
        // Thất bại
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
      
      // Lỗi kết nối hoặc lỗi khác
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSoapClientData({
        institutionCode: '9999',
        branch: '9999',
        clientTypeCode: 'PR',
        shortName: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: 'M',
        birthDate: '',
        identityCardNumber: '',
        identityCardDetails: '',
        mobilePhone: '',
        email: '',
        addressLine1: '',
        city: '',
        salutationCode: 'MR',
        maritalStatusCode: '',
        citizenship: 'VNM',
        clientNumber: '',
        customData: [
          { 
            addInfoType: 'AddInfo01', 
            tagName: 'DefaultTag', 
            tagValue: 'DefaultValue' 
          }
        ]
      });
      setResponse(null);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
        
        {/* Company Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiBuilding2Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Company Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Company Name"
                value={soapClientData.companyName || ''}
                onChange={(e) => handleSoapDataChange('companyName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Short Name*"
                value={soapClientData.shortName}
                onChange={(e) => handleSoapDataChange('shortName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Client Number*"
                value={soapClientData.clientNumber}
                onChange={(e) => handleSoapDataChange('clientNumber', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiUser3Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Client Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="First Name*"
                value={soapClientData.firstName}
                onChange={(e) => handleSoapDataChange('firstName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Middle Name"
                value={soapClientData.middleName}
                onChange={(e) => handleSoapDataChange('middleName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Last Name*"
                value={soapClientData.lastName}
                onChange={(e) => handleSoapDataChange('lastName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Identity Card Number*"
                value={soapClientData.identityCardNumber}
                onChange={(e) => handleSoapDataChange('identityCardNumber', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Identity Card Details"
                value={soapClientData.identityCardDetails}
                onChange={(e) => handleSoapDataChange('identityCardDetails', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Email*"
                type="email"
                value={soapClientData.email}
                onChange={(e) => handleSoapDataChange('email', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Address Line 1"
                value={soapClientData.addressLine1}
                onChange={(e) => handleSoapDataChange('addressLine1', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="City"
                value={soapClientData.city}
                onChange={(e) => handleSoapDataChange('city', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Mobile Phone*"
                value={soapClientData.mobilePhone}
                onChange={(e) => handleSoapDataChange('mobilePhone', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Custom Data */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileList2Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Custom Data</h3>
          </div>
          <div className="p-6">
            {soapClientData.customData.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-end">
                <div className="md:col-span-2">
                  <Input
                    label="Add Info Type"
                    value={item.addInfoType}
                    onChange={(e) => handleCustomDataChange(index, 'addInfoType', e.target.value)}
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Tag Name"
                    value={item.tagName}
                    onChange={(e) => handleCustomDataChange(index, 'tagName', e.target.value)}
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Tag Value"
                    value={item.tagValue}
                    onChange={(e) => handleCustomDataChange(index, 'tagValue', e.target.value)}
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <Button
                    onClick={() => removeCustomData(index)}
                    disabled={soapClientData.customData.length <= 1}
                    variant="danger"
                    className={`w-full ${
                      soapClientData.customData.length <= 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={addCustomData}
              variant="secondary"
              className="mt-2"
            >
              Add Custom Data
            </Button>
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
            className="px-6 py-2.5 transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2.5 min-w-[120px] transition-all duration-300 hover:shadow-md"
            icon={RiSaveLine}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Add client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}