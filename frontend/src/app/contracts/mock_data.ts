import { ContractNode, Customer } from './types';

// Mock Customers
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    type: 'Corporate'
  },
  {
    id: '2',
    name: 'Globex Industries',
    email: 'info@globex.com',
    type: 'Corporate'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    type: 'Individual'
  }
];

// Mock Contracts với cấu trúc phân cấp
export const MOCK_CONTRACTS: ContractNode[] = [
  // Liability Contract 1
  {
    id: 'L001',
    title: 'Liability Contract 1',
    type: 'liability',
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    value: 1000000,
    segment: {
      institution: 'Nam A Bank',
      branch: 'Hoi so Nam A',
      product: 'MasterCard EMV Standard Credit Account',
      serviceGroup: '',
      reportType: 'Cardholder Default',
      role: 'Full Liability'
    },
    customer: MOCK_CUSTOMERS[0], // Acme Corporation
    liability: {
      category: 'Full Liability',
      contractNumber: '001-L-00000006',
      client: 'Test Test Test'
    },
    financial: {
      currency: 'VND',
      available: 0.00,
      balance: 0.00,
      creditLimit: 0.00,
      additionalLimit: 0.00,
      blocked: 0.00
    },
    children: [
      // Issue Contract 1.1
      {
        id: 'I001',
        title: 'Issuing Contract 1.1',
        type: 'issuing',
        status: 'active',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        value: 500000,
        segment: {
          institution: 'Nam A Bank',
          branch: 'Hoi so Nam A',
          product: 'MasterCard EMV Standard Credit Account',
          serviceGroup: '',
          reportType: 'Cardholder Default',
          role: 'Full Liability'
        },
        liability: {
          category: 'Full Liability',
          contractNumber: '001-L-00000006',
          client: 'Test Test Test'
        },
        financial: {
          currency: 'VND',
          available: 0.00,
          balance: 0.00,
          creditLimit: 0.00,
          additionalLimit: 0.00,
          blocked: 0.00
        },
        children: [
          // Card 1.1.1
          {
            id: 'T001',
            title: 'Card 1.1.1',
            type: 'card',
            status: 'active',
            startDate: '2023-01-20',
            endDate: '2023-01-20',
            value: 500000,
            cardDetails: {
              type: 'Disbursement',
              issueContract: 'Issuing Contract 1.1'
            }
          },
          // Card 1.1.2
          {
            id: 'T002',
            title: 'Card 1.1.2',
            type: 'card',
            status: 'active',
            startDate: '2023-02-20',
            endDate: '2023-02-20',
            value: 50000,
            cardDetails: {
              type: 'Repayment',
              issueContract: 'Issuing Contract 1.1'
            }
          }
        ]
      },
      // Issue Contract 1.2
      {
        id: 'I002',
        title: 'Issuing Contract 1.2',
        type: 'issuing',
        status: 'active',
        startDate: '2023-02-01',
        endDate: '2024-02-01',
        value: 200000,
        segment: {
          institution: 'Nam A Bank',
          branch: 'Hoi so Nam A',
          product: 'MasterCard EMV Standard Credit Account',
          serviceGroup: '',
          reportType: 'Cardholder Default',
          role: 'Full Liability'
        },
        liability: {
          category: 'Full Liability',
          contractNumber: '001-L-00000006',
          client: 'Test Test Test'
        },
        financial: {
          currency: 'VND',
          available: 0.00,
          balance: 0.00,
          creditLimit: 0.00,
          additionalLimit: 0.00,
          blocked: 0.00
        },
        children: [
          // Card 1.2.1
          {
            id: 'T003',
            title: 'Card 1.2.1',
            type: 'card',
            status: 'active',
            startDate: '2023-02-15',
            endDate: '2023-02-15',
            value: 75000,
            cardDetails: {
              type: 'Withdrawal',
              issueContract: 'Issuing Contract 1.2'
            }
          }
        ]
      }
    ]
  },
  
  // Liability Contract 2
  {
    id: 'L002',
    title: 'Liability Contract 2',
    type: 'liability',
    status: 'active',
    startDate: '2023-03-01',
    endDate: '2026-03-01',
    value: 2000000,
    segment: {
      institution: 'Nam A Bank',
      branch: 'Hoi so Nam A',
      product: 'MasterCard EMV Standard Credit Account',
      serviceGroup: '',
      reportType: 'Cardholder Default',
      role: 'Full Liability'
    },
    customer: MOCK_CUSTOMERS[1], // Globex Industries
    liability: {
      category: 'Full Liability',
      contractNumber: '001-L-00000007',
      client: 'Globex Industries'
    },
    financial: {
      currency: 'VND',
      available: 0.00,
      balance: 0.00,
      creditLimit: 0.00,
      additionalLimit: 0.00,
      blocked: 0.00
    },
    children: [
      // Issue Contract 2.1
      {
        id: 'I003',
        title: 'Issuing Contract 2.1',
        type: 'issuing',
        status: 'active',
        startDate: '2023-03-15',
        endDate: '2025-03-15',
        value: 1500000,
        segment: {
          institution: 'Nam A Bank',
          branch: 'Hoi so Nam A',
          product: 'MasterCard EMV Standard Credit Account',
          serviceGroup: '',
          reportType: 'Cardholder Default',
          role: 'Full Liability'
        },
        liability: {
          category: 'Full Liability',
          contractNumber: '001-L-00000007',
          client: 'Globex Industries'
        },
        financial: {
          currency: 'VND',
          available: 0.00,
          balance: 0.00,
          creditLimit: 0.00,
          additionalLimit: 0.00,
          blocked: 0.00
        },
        children: [
          // Card 2.1.1
          {
            id: 'T004',
            title: 'Card 2.1.1',
            type: 'card',
            status: 'active',
            startDate: '2023-03-20',
            endDate: '2023-03-20',
            value: 1500000,
            cardDetails: {
              type: 'Disbursement',
              issueContract: 'Issuing Contract 2.1'
            }
          }
        ]
      }
    ]
  },
  
  // Liability Contract 3
  {
    id: 'L003',
    title: 'Liability Contract 3',
    type: 'liability',
    status: 'pending',
    startDate: '2023-04-01',
    endDate: '2025-04-01',
    value: 50000,
    segment: {
      institution: 'Nam A Bank',
      branch: 'Hoi so Nam A',
      product: 'MasterCard EMV Standard Credit Account',
      serviceGroup: '',
      reportType: 'Cardholder Default',
      role: 'Full Liability'
    },
    customer: MOCK_CUSTOMERS[2], // John Smith
    liability: {
      category: 'Full Liability',
      contractNumber: '001-L-00000008',
      client: 'John Smith'
    },
    financial: {
      currency: 'VND',
      available: 0.00,
      balance: 0.00,
      creditLimit: 0.00,
      additionalLimit: 0.00,
      blocked: 0.00
    },
    children: []
  },
  
  // Liability Contract 4
  {
    id: 'L004',
    title: 'Liability Contract 4',
    type: 'liability',
    status: 'active',
    startDate: '2023-05-01',
    endDate: '2026-05-01',
    value: 750000,
    segment: {
      institution: 'Nam A Bank',
      branch: 'Hoi so Nam A',
      product: 'MasterCard EMV Standard Credit Account',
      serviceGroup: '',
      reportType: 'Cardholder Default',
      role: 'Full Liability'
    },
    customer: MOCK_CUSTOMERS[0], // Acme Corporation
    liability: {
      category: 'Full Liability',
      contractNumber: '001-L-00000009',
      client: 'Acme Corporation'
    },
    financial: {
      currency: 'VND',
      available: 0.00,
      balance: 0.00,
      creditLimit: 0.00,
      additionalLimit: 0.00,
      blocked: 0.00
    },
    children: []
  },
  
  // Liability Contract 5
  {
    id: 'L005',
    title: 'Liability Contract 5',
    type: 'liability',
    status: 'closed',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
    value: 300000,
    segment: {
      institution: 'Nam A Bank',
      branch: 'Hoi so Nam A',
      product: 'MasterCard EMV Standard Credit Account',
      serviceGroup: '',
      reportType: 'Cardholder Default',
      role: 'Full Liability'
    },
    customer: MOCK_CUSTOMERS[2], // John Smith
    liability: {
      category: 'Full Liability',
      contractNumber: '001-L-00000010',
      client: 'John Smith'
    },
    financial: {
      currency: 'VND',
      available: 0.00,
      balance: 0.00,
      creditLimit: 0.00,
      additionalLimit: 0.00,
      blocked: 0.00
    },
    children: []
  }
]; 