

export interface ValidationRule {
  required: boolean;
  maxLength?: number;
  exactLength?: number;
  numbersOnly?: boolean;
  alphanumeric?: boolean;
}

export interface ValidationErrors {
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
  status?: string;
  contractsCount?: string;
  cityzenship?: string;
  dateOpen?: string;
  ID?: string;
}

export const validationRules: Record<string, ValidationRule> = {
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
  cityzenship: { required: true, maxLength: 30 },
  dateOpen: { required: true }
};

export const validateField = (name: string, value: string): string => {
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

