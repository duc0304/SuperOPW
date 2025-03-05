import { useState, useEffect, useRef } from 'react';
import { Customer, DEFAULT_FORM_DATA } from '../mock_customers';
import Modal from '@/components/Modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'flag-icons/css/flag-icons.min.css';

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
  phoneNumber?: string;
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
  productCategory: { required: true, maxLength: 30 },
  phoneNumber: { required: false, numbersOnly: true, maxLength: 15 }
};

// Cập nhật mảng quốc gia với thêm thông tin tìm kiếm
const countries = [
  { code: 'vn', name: 'Vietnam', dialCode: '+84', searchTerms: 'vietnam viet nam' },
  { code: 'gb', name: 'United Kingdom', dialCode: '+44', searchTerms: 'uk england great britain' },
  { code: 'cn', name: 'China', dialCode: '+86', searchTerms: 'china chinese' },
  { code: 'jp', name: 'Japan', dialCode: '+81', searchTerms: 'japan japanese' },
  { code: 'np', name: 'Nepal', dialCode: '+977', searchTerms: 'nepal' },
  { code: 'nl', name: 'Netherlands', dialCode: '+31', searchTerms: 'netherlands holland dutch' },
  { code: 'nc', name: 'New Caledonia', dialCode: '+687', searchTerms: 'new caledonia' },
  { code: 'nz', name: 'New Zealand', dialCode: '+64', searchTerms: 'new zealand' },
  { code: 'ar', name: 'Argentina', dialCode: '+54', searchTerms: 'argentina' },
  { code: 'be', name: 'Belgium', dialCode: '+32', searchTerms: 'belgium' },
  { code: 'ca', name: 'Canada', dialCode: '+1', searchTerms: 'canada' },
  { code: 'dk', name: 'Denmark', dialCode: '+45', searchTerms: 'denmark danish' }
];

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
  
  // Thay đổi state cho phone number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  
  // Ref để xử lý click outside dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Validation functions
  const validateField = (name: string, value: string): string => {
    // Xử lý đặc biệt cho phoneNumber
    if (name === 'phoneNumber') {
      return validatePhoneNumber(value);
    }
    
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
      // Bỏ qua phoneNumber vì nó được xử lý riêng
      if (field === 'phoneNumber') return;
      
      const key = field as keyof Omit<Customer, 'id'>;
      const error = validateField(field, data[key] as string);
      if (error) {
        // Sử dụng type assertion để tránh lỗi TypeScript
        (newErrors as Record<string, string>)[key] = error;
      }
    });
    
    // Validate phoneNumber riêng biệt
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }
    
    return newErrors;
  };

  // Cập nhật hàm validatePhoneNumber
  const validatePhoneNumber = (value: string): string => {
    if (!value) return '';
    
    // Chỉ kiểm tra số điện thoại (không bao gồm mã quốc gia)
    if (!/^\d*$/.test(value)) {
      return 'Phone number can only contain digits';
    }
    
    if (value.length < 6) {
      return 'Phone number is too short';
    }
    
    if (value.length > 12) {
      return 'Phone number is too long';
    }
    
    return '';
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

  // Cập nhật handlePhoneChange
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
      
      if (touched.phoneNumber) {
        const error = validatePhoneNumber(value);
        setErrors(prev => ({ ...prev, phoneNumber: error }));
        
        // Cập nhật isFormValid
        const newErrors = { ...errors, phoneNumber: error };
        const hasErrors = Object.values(newErrors).some(error => !!error);
        setIsFormValid(!hasErrors);
      }
    }
  };

  // Thêm hàm xử lý chọn quốc gia
  const handleSelectCountry = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchQuery('');
  };
  
  // Hàm xử lý tìm kiếm quốc gia
  const handleSearchCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredCountries(countries);
      return;
    }
    
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(query) || 
      country.dialCode.includes(query) ||
      country.searchTerms.includes(query)
    );
    
    setFilteredCountries(filtered);
  };
  
  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Reset filtered countries khi đóng dropdown
  useEffect(() => {
    if (!showCountryDropdown) {
      setFilteredCountries(countries);
      setSearchQuery('');
    }
  }, [showCountryDropdown]);

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Cập nhật Phone Number input với thiết kế mới */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative" ref={dropdownRef}>
                  {/* Phone input container */}
                  <div className={`flex rounded-md overflow-hidden ${
                    errors.phoneNumber && touched.phoneNumber 
                      ? 'border border-red-500 dark:border-red-700' 
                      : 'border border-indigo-500 dark:border-indigo-400'
                  }`}>
                    {/* Country selector - thu nhỏ width */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Toggling dropdown");
                          setShowCountryDropdown(!showCountryDropdown);
                        }}
                        className="flex items-center h-full px-2 py-2 bg-white dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 w-[90px] justify-between"
                      >
                        <span className={`fi fi-${selectedCountry.code} mr-1`}></span>
                        <span className="text-gray-700 dark:text-gray-200 text-sm">{selectedCountry.dialCode}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Phone number input - tăng độ rộng */}
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, phoneNumber: true }));
                        const error = validatePhoneNumber(phoneNumber);
                        setErrors(prev => ({ ...prev, phoneNumber: error }));
                        
                        // Cập nhật isFormValid
                        const newErrors = { ...errors, phoneNumber: error };
                        const hasErrors = Object.values(newErrors).some(error => !!error);
                        setIsFormValid(!hasErrors);
                      }}
                      placeholder="Enter phone number"
                      className="flex-1 py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none border-none focus:ring-0 w-full"
                    />
                  </div>
                  
                  {/* Dropdown menu - tách ra khỏi button để tránh bị ẩn */}
                  {showCountryDropdown && (
                    <div 
                      className="absolute z-[1000] mt-1 w-60 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 left-0"
                      style={{ top: "100%" }}
                    >
                      {/* Search input */}
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
  <input
    type="text"
    value={searchQuery}
    onChange={handleSearchCountry}
    placeholder="Search for country"
    className="pl-8 pr-2 py-1 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm"
  />
  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
    <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
</div>
                      </div>
                      
                      {/* Country list */}
                      <ul className="py-1 max-h-60 overflow-auto">
                        {filteredCountries.map((country) => (
                          <li key={country.code}>
                            <button
                              type="button"
                              onClick={() => handleSelectCountry(country)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span className={`fi fi-${country.code} mr-2`}></span>
                                <span>{country.name}</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">{country.dialCode}</span>
                            </button>
                          </li>
                        ))}
                        {filteredCountries.length === 0 && (
                          <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No countries found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Error message */}
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
                )}
              </div>
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