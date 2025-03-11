import { useState, useEffect, useRef } from 'react';
import { Customer, DEFAULT_FORM_DATA } from '../mock_customers';
import Modal from '@/components/Modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'flag-icons/css/flag-icons.min.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function AddCustomerModal({ 
  isOpen, 
  onClose
}: AddCustomerModalProps) {
  const [soapClientData, setSoapClientData] = useState<SoapClientData>({
    institutionCode: '0001',
    branch: '0101',
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

      const response = await axios.post('http://localhost:5000/api/createClient', soapClientData);
      
      console.log('Response from backend:', response.data);
      
      // Hiển thị thông báo thành công rõ ràng hơn
      setResponse("Tạo khách hàng thành công!");
      toast.success('Tạo khách hàng thành công!', {
        duration: 5000, // Hiển thị lâu hơn (5 giây)
        position: 'top-center', // Hiển thị ở giữa màn hình
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          padding: '16px'
        },
      });
      
      // Bỏ đoạn tự động đóng modal
      // setTimeout(() => {
      //   onClose();
      // }, 1500);

    } catch (error: any) {
      console.error('Error:', error);
      
      // Hiển thị thông báo lỗi rõ ràng hơn
      const errorMessage = error.response?.data?.error || 'Tạo khách hàng thất bại';
      setResponse("Lỗi: " + errorMessage);
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
        institutionCode: '0001',
        branch: '0101',
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
      title="Add New Customer"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-md font-medium text-purple-600 dark:text-purple-300">Company Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Company Name*
                </label>
                <input
                  type="text"
                  value={soapClientData.companyName || ''}
                  onChange={(e) => handleSoapDataChange('companyName', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Short Name*
                </label>
                <input
                  type="text"
                  value={soapClientData.shortName}
                  onChange={(e) => handleSoapDataChange('shortName', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Client Number*
                </label>
                <input
                  type="text"
                  value={soapClientData.clientNumber}
                  onChange={(e) => handleSoapDataChange('clientNumber', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-md font-medium text-purple-600 dark:text-purple-300">Client Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name*
                </label>
                <input
                  type="text"
                  value={soapClientData.firstName}
                  onChange={(e) => handleSoapDataChange('firstName', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={soapClientData.middleName}
                  onChange={(e) => handleSoapDataChange('middleName', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name*
                </label>
                <input
                  type="text"
                  value={soapClientData.lastName}
                  onChange={(e) => handleSoapDataChange('lastName', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Identity Card Number*
                </label>
                <input
                  type="text"
                  value={soapClientData.identityCardNumber}
                  onChange={(e) => handleSoapDataChange('identityCardNumber', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Identity Card Details
                </label>
                <input
                  type="text"
                  value={soapClientData.identityCardDetails}
                  onChange={(e) => handleSoapDataChange('identityCardDetails', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email*
                </label>
                <input
                  type="email"
                  value={soapClientData.email}
                  onChange={(e) => handleSoapDataChange('email', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={soapClientData.addressLine1}
                  onChange={(e) => handleSoapDataChange('addressLine1', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={soapClientData.city}
                  onChange={(e) => handleSoapDataChange('city', e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mobile Phone*
                </label>
                <input
                  type="text"
                  value={soapClientData.mobilePhone}
                  onChange={(e) => handleSoapDataChange('mobilePhone', e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Data */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-md font-medium text-purple-600 dark:text-purple-300">Custom Data</h3>
          </div>
          <div className="p-4">
            {soapClientData.customData.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Add Info Type
                  </label>
                  <input
                    type="text"
                    value={item.addInfoType}
                    onChange={(e) => handleCustomDataChange(index, 'addInfoType', e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={item.tagName}
                    onChange={(e) => handleCustomDataChange(index, 'tagName', e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tag Value
                  </label>
                  <input
                    type="text"
                    value={item.tagValue}
                    onChange={(e) => handleCustomDataChange(index, 'tagValue', e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={() => removeCustomData(index)}
                    disabled={soapClientData.customData.length <= 1}
                    className={`w-full py-2 px-4 rounded-md ${
                      soapClientData.customData.length <= 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCustomData}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Custom Data
            </button>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-md font-medium text-purple-600 dark:text-purple-300">Kết quả</h3>
            </div>
            <div className="p-4">
              <div className={`p-4 rounded-md text-center text-lg font-medium ${
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
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Tạo khách hàng'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 