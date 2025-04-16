import { ContractNode } from './types';

export const mockContracts: ContractNode[] = [
  {
    id: "361110",
    title: "Liability Contract",
    type: "liability",
    contractNumber: "001-P-695143",
    oracleData: {
      AMND_DATE: "2025-03-28T07:57:42.000Z",
      AMND_STATE: "A",
      AMND_OFFICER: 210,
      AMND_PREV: 361110,
      ID: 361110,
      PCAT: "C",
      CON_CAT: "A",
      TERMINAL_CATEGORY: null,
      CCAT: "P",
      F_I: 1,
      BRANCH: "0101",
      SERVICE_GROUP: null,
      CONTRACT_NUMBER: "001-P-695143",
      BASE_RELATION: null,
      CONTRACT_NAME: "Liability Contract",
      COMMENT_TEXT: null,
      RELATION_TAG: null,
      ACNT_CONTRACT__ID: null,
      CONTR_TYPE: 57,
      CONTR_SUBTYPE__ID: 102,
      SERV_PACK__ID: 655,
      ACC_SCHEME__ID: 807,
      OLD_PACK: 655,
      CHANNEL: "O",
      OLD_SCHEME: 807,
      PRODUCT: "250314000000000000000590",
      PARENT_PRODUCT: null,
      PRODUCT_PREV: "250314000000000000000590",
      MAIN_PRODUCT: 590,
      LIAB_CATEGORY: null,
      CLIENT__ID: 84760,
      CLIENT_TYPE: 3,
      ACNT_CONTRACT__OID: null,
      LIAB_CONTRACT: null,
      LIAB_CONTRACT_PREV: null,
      BILLING_CONTRACT: 361110,
    },
    children: [
      {
        id: "361120",
        title: "Issuing Contract",
        type: "issue",
        contractNumber: "001-P-810407",
        oracleData: {
          AMND_DATE: "2025-03-28T08:12:30.000Z",
          AMND_STATE: "A",
          AMND_OFFICER: 1,
          AMND_PREV: 361120,
          ID: 361120,
          PCAT: "C",
          CONTRACT_NUMBER: "001-P-810407",
          CONTRACT_NAME: "Issuing Contract",
          CLIENT__ID: 84760,
          LIAB_CONTRACT: 361110,
          LIAB_CONTRACT_PREV: 361110,
          TR_FIRST_NAM: "PRO", 
          TR_LAST_NAM: "MAX",
          BRANCH: "0101"
        },
        children: [
          {
            id: "361121",
            title: "Card Contract",
            type: "card",
            contractNumber: "1000012345678901",
            oracleData: {
              AMND_DATE: "2025-03-28T08:15:20.000Z",
              AMND_STATE: "A",
              ID: 361121,
              CONTRACT_NUMBER: "1000012345678901",
              CONTRACT_NAME: "Card Contract",
              CLIENT__ID: 84760,
              ACNT_CONTRACT__OID: 361120,
              CARD_NUMBER: "1000012345678901", 
              TR_FIRST_NAM: "PRO", 
              TR_LAST_NAM: "MAX",
              BRANCH: "0101"
            },
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "361210",
    title: "Liability Contract 2",
    type: "liability",
    contractNumber: "001-P-695144",
    oracleData: {
      AMND_DATE: "2025-03-28T07:57:42.000Z",
      AMND_STATE: "A",
      ID: 361210,
      CONTRACT_NUMBER: "001-P-695144",
      CONTRACT_NAME: "Liability Contract 2",
      CLIENT__ID: 84761,
      BRANCH: "0102"
    },
    children: [
      {
        id: "361220",
        title: "Issuing Contract 2",
        type: "issue",
        contractNumber: "001-P-810408",
        oracleData: {
          AMND_DATE: "2025-03-28T08:12:30.000Z",
          ID: 361220,
          CONTRACT_NUMBER: "001-P-810408",
          CONTRACT_NAME: "Issuing Contract 2",
          CLIENT__ID: 84761,
          LIAB_CONTRACT: 361210,
          TR_FIRST_NAM: "JOHN", 
          TR_LAST_NAM: "DOE",
          BRANCH: "0102"
        },
        children: [
          {
            id: "361221",
            title: "Card Contract 2",
            type: "card",
            contractNumber: "1000023456789012",
            oracleData: {
              AMND_DATE: "2025-03-28T08:15:20.000Z",
              ID: 361221,
              CONTRACT_NUMBER: "1000023456789012",
              CONTRACT_NAME: "Card Contract 2",
              CLIENT__ID: 84761,
              ACNT_CONTRACT__OID: 361220,
              CARD_NUMBER: "1000023456789012", 
              TR_FIRST_NAM: "JOHN", 
              TR_LAST_NAM: "DOE",
              BRANCH: "0102"
            },
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "361310",
    title: "Liability Contract 3",
    type: "liability",
    contractNumber: "001-P-695145",
    oracleData: {
      AMND_DATE: "2025-03-28T07:57:42.000Z",
      ID: 361310,
      CONTRACT_NUMBER: "001-P-695145",
      CONTRACT_NAME: "Liability Contract 3",
      CLIENT__ID: 84762,
      BRANCH: "0103"
    },
    children: [
      {
        id: "361320",
        title: "Issuing Contract 3",
        type: "issue",
        contractNumber: "001-P-810409",
        oracleData: {
          AMND_DATE: "2025-03-28T08:12:30.000Z",
          ID: 361320,
          CONTRACT_NUMBER: "001-P-810409",
          CONTRACT_NAME: "Issuing Contract 3",
          CLIENT__ID: 84762,
          LIAB_CONTRACT: 361310,
          TR_FIRST_NAM: "JANE", 
          TR_LAST_NAM: "SMITH",
          BRANCH: "0103"
        },
        children: [
          {
            id: "361321",
            title: "Card Contract 3",
            type: "card",
            contractNumber: "1000034567890123",
            oracleData: {
              AMND_DATE: "2025-03-28T08:15:20.000Z",
              ID: 361321,
              CONTRACT_NUMBER: "1000034567890123",
              CONTRACT_NAME: "Card Contract 3",
              CLIENT__ID: 84762,
              ACNT_CONTRACT__OID: 361320,
              CARD_NUMBER: "1000034567890123", 
              TR_FIRST_NAM: "JANE", 
              TR_LAST_NAM: "SMITH",
              BRANCH: "0103"
            },
            children: []
          }
        ]
      }
    ]
  }
];

export const mockContractResponse = {
  data: {
    contracts: mockContracts,
    pagination: {
      total: 3,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1
    }
  }
}; 