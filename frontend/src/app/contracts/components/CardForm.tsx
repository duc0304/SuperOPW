import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  RiAddLine, 
  RiArrowLeftLine,
  RiIdCardLine,
  RiInformationLine
} from 'react-icons/ri';
import { ContractNode } from '../types';

interface CardFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface CardData {
  contractSearchMethod: string;
  contractIdentifier: string;
  productCode: string;
  productCode2: string;
  productCode3: string;
  cardName: string;
  cbsNumber: string;
  embossedFirstName: string;
  embossedLastName: string;
  embossedCompanyName: string;
  sessionContext?: string;
  correlationId?: string;
}

export default function CardForm({ onBack, onClose }: CardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    contractSearchMethod: 'CONTRACT_NUMBER',
    contractIdentifier: '',
    productCode: 'MC_CR_GLD_M',
    productCode2: '',
    productCode3: '',
    cardName: 'Card Contract',
    cbsNumber: '',
    embossedFirstName: '',
    embossedLastName: '',
    embossedCompanyName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleCardDataChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      console.log('Sending card data to backend:', cardData);

      const response = await axios.post('http://localhost:5000/api/createCard', cardData);
      
      console.log('Response from backend:', response.data);
      
      if (response.data.success) {
        setResponse("Tạo thẻ thành công!");
        toast.success('Tạo thẻ thành công!', {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            padding: '16px'
          },
        });
        
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
      
      {/* Card Type Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 
        rounded-2xl shadow-xl border-2 border-emerald-200/60 dark:border-emerald-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiIdCardLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Card</h3>
          <button 
            type="button"
            className="ml-auto text-white/80 hover:text-white transition-colors duration-200"
            onClick={onBack}
          >
            Thay đổi
          </button>
        </div>
      </div>
      
      {/* Contract Search Information */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiIdCardLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Contract Search Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Select
                label="Contract Search Method*"
                value={cardData.contractSearchMethod}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCardDataChange('contractSearchMethod', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                required
              >
                <option value="CONTRACT_NUMBER">CONTRACT_NUMBER</option>
                <option value="CONTRACT_ID">CONTRACT_ID</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Contract Identifier*"
                value={cardData.contractIdentifier}
                onChange={(e) => handleCardDataChange('contractIdentifier', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Information */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiIdCardLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Card Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Card Name*"
                value={cardData.cardName}
                onChange={(e) => handleCardDataChange('cardName', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                required
              />
            </div>
            <div>
              <Input
                label="CBS Number"
                value={cardData.cbsNumber}
                onChange={(e) => handleCardDataChange('cbsNumber', e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Product Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Product Code*"
                  value={cardData.productCode}
                  onChange={(e) => handleCardDataChange('productCode', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <Input
                  label="Product Code 2"
                  value={cardData.productCode2}
                  onChange={(e) => handleCardDataChange('productCode2', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                />
              </div>
              <div>
                <Input
                  label="Product Code 3"
                  value={cardData.productCode3}
                  onChange={(e) => handleCardDataChange('productCode3', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Embossed Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Embossed First Name*"
                  value={cardData.embossedFirstName}
                  onChange={(e) => handleCardDataChange('embossedFirstName', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <Input
                  label="Embossed Last Name*"
                  value={cardData.embossedLastName}
                  onChange={(e) => handleCardDataChange('embossedLastName', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <Input
                  label="Embossed Company Name"
                  value={cardData.embossedCompanyName}
                  onChange={(e) => handleCardDataChange('embossedCompanyName', e.target.value)}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Response Display */}
      {response && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
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
          onClick={onBack}
          variant="secondary"
          icon={RiArrowLeftLine}
          className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-teal-200 dark:border-teal-700/50"
        >
          Back
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-teal-200 dark:border-teal-700/50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={RiAddLine}
          disabled={isSubmitting}
          className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-300 transform hover:-translate-y-1 border-2 border-emerald-300/20"
        >
          {isSubmitting ? 'Processing...' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
} 