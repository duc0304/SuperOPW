import { useState, useEffect } from 'react';
import { Customer, DEFAULT_FORM_DATA } from '../mock_customers';
import Modal from '@/components/Modal';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Omit<Customer, 'id'>;
  setFormData: (data: Omit<Customer, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Định nghĩa interface cho ValidationErrors
interface ValidationErrors {
  companyName?: string;
  shortName?: string;
  clientNumber?: string;
  clientTypeCode?: string;
  reasonCode?: string;
  reason?: string;
  institutionCode?: string;
  branch?: string;
  clientCategory?: string;
  productCategory?: string;
}

// Định nghĩa các quy tắc validation cho từng trường
const validationRules: Record<string, {
  required: boolean;
  maxLength?: number;
  exactLength?: number;
  numbersOnly?: boolean;
  alphanumeric?: boolean;
}> = {
  companyName: { required: true, maxLength: 50 },
  shortName: { required: true, maxLength: 20 },
  clientNumber: { required: true, exactLength: 10, numbersOnly: true },
  clientTypeCode: { required: true, exactLength: 4, alphanumeric: true },
  reasonCode: { required: true, exactLength: 3, alphanumeric: true },
  reason: { required: true, maxLength: 50 },
  institutionCode: { required: true, exactLength: 5, alphanumeric: true },
  branch: { required: true, maxLength: 30 },
  clientCategory: { required: true, maxLength: 30 },
  productCategory: { required: true, maxLength: 30 }
};

export default function AddCustomerModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit 
}: AddCustomerModalProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    // Trim value to check if it's empty after trimming
    const trimmedValue = value.trim();
    
    const rules = validationRules[name];
    
    if (!rules) return '';
    
    if (rules.required && trimmedValue === '') {
      return `Must enter ${name.replace(/([A-Z])/g, ' $1').trim()}`;
    }
    
    if (rules.exactLength && trimmedValue.length !== rules.exactLength) {
      return `Must be exactly ${rules.exactLength} characters`;
    }
    
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return `Cannot exceed ${rules.maxLength} characters`;
    }
    
    if (rules.numbersOnly && !/^\d*$/.test(trimmedValue)) {
      return 'Must contain only numbers';
    }
    
    if (rules.alphanumeric && !/^[a-zA-Z0-9]*$/.test(trimmedValue)) {
      return 'Must contain only letters and numbers';
    }
    
    return '';
  };

  const validateForm = (data: Omit<Customer, 'id'>): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    // Validate each field
    Object.keys(validationRules).forEach(field => {
      const key = field as keyof Omit<Customer, 'id'>;
      const error = validateField(field, data[key] as string);
      if (error) {
        // Sử dụng type assertion để tránh lỗi TypeScript
        (newErrors as Record<string, string>)[key] = error;
      }
    });
    
    return newErrors;
  };

  // Handle form changes
  const handleChange = (field: keyof Omit<Customer, 'id'>, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Validate on change if field has been touched
    if (touched[field]) {
      const error = validateField(field as string, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    
    // Check if form is valid
    const newErrors = validateForm(newFormData);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Handle field blur
  const handleBlur = (field: keyof Omit<Customer, 'id'>) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field as string, formData[field] as string);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // Check if form is valid
    const newErrors = validateForm(formData);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Validate form on initial load and when formData changes
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  // Reset touched state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTouched({});
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFormData(DEFAULT_FORM_DATA);
        onClose();
      }}
      title="Add New Customer"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid) {
          onSubmit(e);
        }
      }} className="space-y-5">
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
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  onBlur={() => handleBlur('companyName')}
                  className={errors.companyName && touched.companyName ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.companyName && touched.companyName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Short Name*
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => handleChange('shortName', e.target.value)}
                  onBlur={() => handleBlur('shortName')}
                  className={errors.shortName && touched.shortName ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.shortName && touched.shortName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shortName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Client Number*
                </label>
                <input
                  type="text"
                  value={formData.clientNumber}
                  onChange={(e) => handleChange('clientNumber', e.target.value)}
                  onBlur={() => handleBlur('clientNumber')}
                  className={errors.clientNumber && touched.clientNumber ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.clientNumber && touched.clientNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientNumber}</p>
                )}
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
                  Client Type Code*
                </label>
                <input
                  type="text"
                  value={formData.clientTypeCode}
                  onChange={(e) => handleChange('clientTypeCode', e.target.value)}
                  onBlur={() => handleBlur('clientTypeCode')}
                  className={errors.clientTypeCode && touched.clientTypeCode ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.clientTypeCode && touched.clientTypeCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientTypeCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Reason Code*
                </label>
                <input
                  type="text"
                  value={formData.reasonCode}
                  onChange={(e) => handleChange('reasonCode', e.target.value)}
                  onBlur={() => handleBlur('reasonCode')}
                  className={errors.reasonCode && touched.reasonCode ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.reasonCode && touched.reasonCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reasonCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Reason*
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  onBlur={() => handleBlur('reason')}
                  className={errors.reason && touched.reason ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.reason && touched.reason && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Institution Code*
                </label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  onChange={(e) => handleChange('institutionCode', e.target.value)}
                  onBlur={() => handleBlur('institutionCode')}
                  className={errors.institutionCode && touched.institutionCode ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.institutionCode && touched.institutionCode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.institutionCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Branch*
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  onBlur={() => handleBlur('branch')}
                  className={errors.branch && touched.branch ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.branch && touched.branch && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.branch}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-md font-medium text-purple-600 dark:text-purple-300">Category Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Client Category*
                </label>
                <input
                  type="text"
                  value={formData.clientCategory}
                  onChange={(e) => handleChange('clientCategory', e.target.value)}
                  onBlur={() => handleBlur('clientCategory')}
                  className={errors.clientCategory && touched.clientCategory ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.clientCategory && touched.clientCategory && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientCategory}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Product Category*
                </label>
                <input
                  type="text"
                  value={formData.productCategory}
                  onChange={(e) => handleChange('productCategory', e.target.value)}
                  onBlur={() => handleBlur('productCategory')}
                  className={errors.productCategory && touched.productCategory ? 'w-full border border-red-500 dark:border-red-700 rounded-md p-2 focus:outline-none focus:border-red-500 focus:ring focus:ring-red-200 dark:focus:border-red-700 dark:focus:ring-red-900/30' : 'input w-full'}
                />
                {errors.productCategory && touched.productCategory && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.productCategory}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="input w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setFormData(DEFAULT_FORM_DATA);
              onClose();
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={isFormValid ? "btn btn-primary" : "bg-gray-400 dark:bg-gray-600 text-white py-2 px-4 rounded-md cursor-not-allowed"}
          >
            Add Customer
          </button>
        </div>
      </form>
    </Modal>
  );
} 