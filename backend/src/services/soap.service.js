const axios = require('axios');
const xml2js = require('xml2js');

const SOAP_API_URL = 'http://10.145.48.222:17000/webservice_int/ws';

exports.createClient = async (clientData) => {
  try {
    // Log request data
    console.log('Received client data:', clientData);

    // Tạo SOAP envelope từ dữ liệu client
    const soapEnvelope = generateCreateClientXML(clientData);
    
    console.log('Sending SOAP request:', soapEnvelope);

    const response = await axios.post(SOAP_API_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      }
    });

    console.log('SOAP Response:', response.data);
    
    // Parse XML response
    const parsedResponse = await parseXmlResponse(response.data);
    
    // Kiểm tra RetCode
    const retCode = getRetCodeFromResponse(parsedResponse, 'CreateClientV4Response');
    const retMsg = getRetMsgFromResponse(parsedResponse, 'CreateClientV4Response');
    
    // Trả về kết quả có cấu trúc
    return {
      success: retCode === '0',
      retCode: retCode,
      message: retMsg,
      rawResponse: response.data
    };
    
  } catch (error) {
    console.error('SOAP Error:', error.response?.data || error.message);
    throw error;
  }
};

// Thêm hàm mới để xử lý tạo contract
exports.createContract = async (contractData) => {
  try {
    // Log request data
    console.log('Received contract data:', contractData);

    // Tạo SOAP envelope từ dữ liệu contract
    const soapEnvelope = generateCreateContractXML(contractData);
    
    console.log('Sending SOAP request:', soapEnvelope);

    const response = await axios.post(SOAP_API_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      }
    });

    console.log('SOAP Response:', response.data);
    
    // Parse XML response
    const parsedResponse = await parseXmlResponse(response.data);
    
    // Kiểm tra RetCode
    const retCode = getRetCodeFromResponse(parsedResponse, 'CreateContractV4Response');
    const retMsg = getRetMsgFromResponse(parsedResponse, 'CreateContractV4Response');
    
    // Trả về kết quả có cấu trúc
    return {
      success: retCode === '0',
      retCode: retCode,
      message: retMsg,
      rawResponse: response.data
    };
    
  } catch (error) {
    console.error('SOAP Error:', error.response?.data || error.message);
    throw error;
  }
};

// Thêm hàm mới để xử lý tạo card
exports.createCard = async (cardData) => {
  try {
    // Log request data
    console.log('Received card data:', cardData);

    // Tạo SOAP envelope từ dữ liệu card
    const soapEnvelope = generateCreateCardXML(cardData);
    
    console.log('Sending SOAP request:', soapEnvelope);

    const response = await axios.post(SOAP_API_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      }
    });

    console.log('SOAP Response:', response.data);
    
    // Parse XML response
    const parsedResponse = await parseXmlResponse(response.data);
    
    // Kiểm tra RetCode
    const retCode = getRetCodeFromResponse(parsedResponse, 'CreateCardV3Response');
    const retMsg = getRetMsgFromResponse(parsedResponse, 'CreateCardV3Response');
    
    // Lấy thông tin thẻ từ response
    
    // Trả về kết quả có cấu trúc
    return {
      success: retCode === '0',
      retCode: retCode,
      message: retMsg,
      rawResponse: response.data
    };
    
  } catch (error) {
    console.error('SOAP Error:', error.response?.data || error.message);
    throw error;
  }
};

// Thêm hàm mới để xử lý tạo issuing contract
exports.createIssuingContract = async (issuingContractData) => {
  try {
    // Log request data
    console.log('Received issuing contract data:', issuingContractData);

    // Tạo SOAP envelope từ dữ liệu issuing contract
    const soapEnvelope = generateCreateIssuingContractXML(issuingContractData);
    
    console.log('Sending SOAP request:', soapEnvelope);

    const response = await axios.post(SOAP_API_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': ''
      }
    });

    console.log('SOAP Response:', response.data);
    
    // Parse XML response
    const parsedResponse = await parseXmlResponse(response.data);
    
    // Kiểm tra RetCode
    const retCode = getRetCodeFromResponse(parsedResponse, 'CreateIssuingContractWithLiabilityV2Response');
    const retMsg = getRetMsgFromResponse(parsedResponse, 'CreateIssuingContractWithLiabilityV2Response');
    
    // Trả về kết quả có cấu trúc
    return {
      success: retCode === '0',
      retCode: retCode,
      message: retMsg,
      rawResponse: response.data
    };
    
  } catch (error) {
    console.error('SOAP Error:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm parse XML response
async function parseXmlResponse(xmlData) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Hàm lấy RetCode từ response
function getRetCodeFromResponse(parsedResponse, responseType) {
  try {
    return parsedResponse['s:Envelope']['s:Body']
      [responseType]
      [`${responseType.replace('Response', '')}Result`]
      ['RetCode'] || '9999';
  } catch (error) {
    console.error('Error extracting RetCode:', error);
    return '9999'; // Mã lỗi mặc định nếu không tìm thấy RetCode
  }
}

// Hàm lấy RetMsg từ response
function getRetMsgFromResponse(parsedResponse, responseType) {
  try {
    return parsedResponse['s:Envelope']['s:Body']
      [responseType]
      [`${responseType.replace('Response', '')}Result`]
      ['RetMsg'] || 'Unknown error';
  } catch (error) {
    console.error('Error extracting RetMsg:', error);
    return 'Unknown error'; // Thông báo lỗi mặc định nếu không tìm thấy RetMsg
  }
}

// Hàm lấy thông tin thẻ từ response


// Hàm tạo XML cho CreateClient request
function generateCreateClientXML(clientData) {
  // Tạo phần SetCustomData_InObject
  let customDataXML = '';
  
  // Nếu có customData trong request, sử dụng nó
  if (clientData.customData && clientData.customData.length > 0) {
    customDataXML = clientData.customData.map(item => `
         <wsin:SetCustomData_InObject>
            <wsin:AddInfoType>${item.addInfoType || 'AddInfo01'}</wsin:AddInfoType>
            <wsin:TagName>${item.tagName || ''}</wsin:TagName>
            <wsin:TagValue>${item.tagValue || ''}</wsin:TagValue>
         </wsin:SetCustomData_InObject>`).join('');
  } else {
    // Nếu không có, thêm một SetCustomData_InObject mặc định
    customDataXML = `
         <wsin:SetCustomData_InObject>
            <wsin:AddInfoType>AddInfo01</wsin:AddInfoType>
            <wsin:TagName>DefaultTag</wsin:TagName>
            <wsin:TagValue>DefaultValue</wsin:TagValue>
         </wsin:SetCustomData_InObject>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsin="http://www.openwaygroup.com/wsint">
   <soapenv:Header>
      <wsin:SessionContextStr>${clientData.sessionContext || ''}</wsin:SessionContextStr>
      <wsin:UserInfo>officer="WX_ADMIN"</wsin:UserInfo>
      <wsin:CorrelationId>${clientData.correlationId || generateCorrelationId()}</wsin:CorrelationId>
   </soapenv:Header>
   <soapenv:Body>
      <wsin:CreateClientV4>
         <wsin:Reason>Create Client</wsin:Reason>        
         <wsin:CreateClient_InObject>
            <wsin:InstitutionCode>${clientData.institutionCode || '0001'}</wsin:InstitutionCode>
            <wsin:Branch>${clientData.branch || '0101'}</wsin:Branch>
            <wsin:ClientTypeCode>${clientData.clientTypeCode || 'PR'}</wsin:ClientTypeCode>
            <wsin:ShortName>${clientData.shortName || ''}</wsin:ShortName>
            <wsin:FirstName>${clientData.firstName || ''}</wsin:FirstName>
            <wsin:LastName>${clientData.lastName || ''}</wsin:LastName>
            <wsin:MiddleName>${clientData.middleName || ''}</wsin:MiddleName>
            <wsin:MaritalStatusCode>${clientData.maritalStatusCode || ''}</wsin:MaritalStatusCode>
            <wsin:SocialSecurityNumber>${clientData.socialSecurityNumber || ''}</wsin:SocialSecurityNumber>
            <wsin:SalutationCode>${clientData.salutationCode || 'MR'}</wsin:SalutationCode>
            <wsin:BirthDate>${clientData.birthDate || ''}</wsin:BirthDate>
            <wsin:Gender>${clientData.gender || ''}</wsin:Gender>
            <wsin:Citizenship>${clientData.citizenship || 'VNM'}</wsin:Citizenship>
            <wsin:IndividualTaxpayerNumber>${clientData.individualTaxpayerNumber || ''}</wsin:IndividualTaxpayerNumber>
            <wsin:CompanyName>${clientData.companyName || ''}</wsin:CompanyName>
            <wsin:IdentityCardNumber>${clientData.identityCardNumber || ''}</wsin:IdentityCardNumber>
            <wsin:IdentityCardDetails>${clientData.identityCardDetails || ''}</wsin:IdentityCardDetails>
            <wsin:ClientNumber>${clientData.clientNumber || ''}</wsin:ClientNumber>
            <wsin:Profession>${clientData.profession || ''}</wsin:Profession>
            <wsin:EMail>${clientData.email || ''}</wsin:EMail>
            <wsin:AddressLine1>${clientData.addressLine1 || ''}</wsin:AddressLine1>
            <wsin:City>${clientData.city || ''}</wsin:City>
            <wsin:HomePhone>${clientData.homePhone || ''}</wsin:HomePhone>
            <wsin:MobilePhone>${clientData.mobilePhone || ''}</wsin:MobilePhone>
         </wsin:CreateClient_InObject>
         ${customDataXML}
      </wsin:CreateClientV4>      
   </soapenv:Body>
</soapenv:Envelope>`;
}

// Hàm tạo XML cho CreateContract request
function generateCreateContractXML(contractData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsin="http://www.openwaygroup.com/wsint">
   <soapenv:Header>
      <wsin:SessionContextStr>${contractData.sessionContext || ''}</wsin:SessionContextStr>
      <wsin:UserInfo>officer="WX_ADMIN"</wsin:UserInfo>
      <wsin:CorrelationId>${contractData.correlationId || generateCorrelationId()}</wsin:CorrelationId>
   </soapenv:Header>
   <soapenv:Body>
      <wsin:CreateContractV4>
         <wsin:ClientSearchMethod>${contractData.clientSearchMethod || 'CLIENT_NUMBER'}</wsin:ClientSearchMethod>
         <wsin:ClientIdentifier>${contractData.clientIdentifier || ''}</wsin:ClientIdentifier>
         <wsin:Reason>${contractData.reason || 'to test'}</wsin:Reason>
         <wsin:CreateContract_InObject>
            <wsin:Branch>${contractData.branch || '0101'}</wsin:Branch>
            <wsin:InstitutionCode>${contractData.institutionCode || '0001'}</wsin:InstitutionCode>
            <wsin:ProductCode>${contractData.productCode || 'ISS_CR_P_LIB'}</wsin:ProductCode>
            <wsin:ProductCode2>${contractData.productCode2 || ''}</wsin:ProductCode2>
            <wsin:ProductCode3>${contractData.productCode3 || ''}</wsin:ProductCode3>
            <wsin:ContractName>${contractData.contractName || 'Liability Contract'}</wsin:ContractName>
            <wsin:CBSNumber>${contractData.cbsNumber || ''}</wsin:CBSNumber>
         </wsin:CreateContract_InObject>
         <wsin:SetCustomData_InObject>
         </wsin:SetCustomData_InObject>
      </wsin:CreateContractV4>
   </soapenv:Body>
</soapenv:Envelope>`;
}

// Hàm tạo XML cho CreateCard request
function generateCreateCardXML(cardData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsin="http://www.openwaygroup.com/wsint">
   <soapenv:Header>
      <wsin:SessionContextStr>${cardData.sessionContext || ''}</wsin:SessionContextStr>
      <wsin:UserInfo>officer="WX_ADMIN"</wsin:UserInfo>
      <wsin:CorrelationId>${cardData.correlationId || generateCorrelationId()}</wsin:CorrelationId>
   </soapenv:Header>
   <soapenv:Body>
      <wsin:CreateCardV3>
         <wsin:ContractSearchMethod>${cardData.contractSearchMethod || 'CONTRACT_NUMBER'}</wsin:ContractSearchMethod>
         <wsin:ContractIdentifier>${cardData.contractIdentifier || ''}</wsin:ContractIdentifier>
         <wsin:ProductCode>${cardData.productCode || ''}</wsin:ProductCode>
         <wsin:ProductCode2>${cardData.productCode2 || ''}</wsin:ProductCode2>
         <wsin:ProductCode3>${cardData.productCode3 || ''}</wsin:ProductCode3>
         <wsin:InObject>
            <wsin:CardName>${cardData.cardName || 'Card Contract'}</wsin:CardName>
            <wsin:CBSNumber>${cardData.cbsNumber || ''}</wsin:CBSNumber>
            <wsin:EmbossedFirstName>${cardData.embossedFirstName || ''}</wsin:EmbossedFirstName>
            <wsin:EmbossedLastName>${cardData.embossedLastName || ''}</wsin:EmbossedLastName>
            <wsin:EmbossedCompanyName>${cardData.embossedCompanyName || ''}</wsin:EmbossedCompanyName>
         </wsin:InObject>  
      </wsin:CreateCardV3>
   </soapenv:Body>
</soapenv:Envelope>`;
}

// Hàm tạo XML cho CreateIssuingContract request
function generateCreateIssuingContractXML(issuingContractData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsin="http://www.openwaygroup.com/wsint">
   <soapenv:Header>
      <wsin:SessionContextStr>${issuingContractData.sessionContext || ''}</wsin:SessionContextStr>
      <wsin:UserInfo>officer="WX_ADMIN"</wsin:UserInfo>
      <wsin:CorrelationId>${issuingContractData.correlationId || generateCorrelationId()}</wsin:CorrelationId>
   </soapenv:Header>
   <soapenv:Body>
      <wsin:CreateIssuingContractWithLiabilityV2>
      	<wsin:LiabCategory>${issuingContractData.liabCategory || 'Y'}</wsin:LiabCategory>
      	<wsin:LiabContractSearchMethod>${issuingContractData.liabContractSearchMethod || 'CONTRACT_NUMBER'}</wsin:LiabContractSearchMethod>
      	<wsin:LiabContractIdentifier>${issuingContractData.liabContractIdentifier || ''}</wsin:LiabContractIdentifier>
         <wsin:ClientSearchMethod>${issuingContractData.clientSearchMethod || 'CLIENT_NUMBER'}</wsin:ClientSearchMethod>
         <wsin:ClientIdentifier>${issuingContractData.clientIdentifier || ''}</wsin:ClientIdentifier>
         <wsin:ProductCode>${issuingContractData.productCode || 'MC_CR_GLD'}</wsin:ProductCode>
         <wsin:ProductCode2>${issuingContractData.productCode2 || ''}</wsin:ProductCode2>
         <wsin:ProductCode3>${issuingContractData.productCode3 || ''}</wsin:ProductCode3>
         <wsin:InObject>
            <wsin:Branch>${issuingContractData.branch || '001'}</wsin:Branch>
            <wsin:InstitutionCode>${issuingContractData.institutionCode || '0001'}</wsin:InstitutionCode>
            <wsin:ContractName>${issuingContractData.contractName || 'Issuing Contract'}</wsin:ContractName>
            <wsin:CBSNumber>${issuingContractData.cbsNumber || ''}</wsin:CBSNumber>
            <wsin:AddInfo01>${issuingContractData.addInfo01 || 'PAYMENT_OPTION=MTP;START_DATE=0123;BANK=A1;ACCOUNT=A2;BANK_CODE=A3;ACC_NAME=A4;'}</wsin:AddInfo01>
            <wsin:AddInfo02>${issuingContractData.addInfo02 || 'PAYMENT_OPTION=MTP;'}</wsin:AddInfo02>
         </wsin:InObject>  
      </wsin:CreateIssuingContractWithLiabilityV2>
   </soapenv:Body>
</soapenv:Envelope>`;
}

// Hàm tạo CorrelationId ngẫu nhiên
function generateCorrelationId() {
  return 'CID-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 