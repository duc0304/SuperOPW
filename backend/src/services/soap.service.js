const axios = require('axios');

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
    return response.data;
  } catch (error) {
    console.error('SOAP Error:', error.response?.data || error.message);
    throw error;
  }
};

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
            <wsin:Branch>${clientData.branch || '001'}</wsin:Branch>
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

// Hàm tạo CorrelationId ngẫu nhiên
function generateCorrelationId() {
  return 'CID-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 