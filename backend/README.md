# Backend API cho OpenWay Web Service

Backend API này cung cấp các endpoint để tương tác với OpenWay Web Service thông qua SOAP API.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

## API Endpoints

### 1. Tạo Client

**Endpoint:** `POST /api/createClient`

**Request Body:**

```json
{
  "firstName": "Nguyen",
  "lastName": "Van A",
  "middleName": "",
  "identityCardNumber": "123456789",
  "mobilePhone": "0987654321",
  "email": "nguyenvana@example.com",
  "addressLine1": "123 Đường ABC, Quận XYZ",
  "city": "Hà Nội",
  "customData": [
    {
      "addInfoType": "AddInfo01",
      "tagName": "CustomTag1",
      "tagValue": "CustomValue1"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "retCode": "0",
  "message": "Success",
  "rawResponse": "XML response from SOAP service"
}
```

### 2. Tạo Contract

**Endpoint:** `POST /api/createContract`

**Request Body:**

```json
{
  "clientSearchMethod": "CLIENT_NUMBER",
  "clientIdentifier": "099773245419",
  "reason": "to test",
  "branch": "0101",
  "institutionCode": "0001",
  "productCode": "ISS_CR_P_LIB",
  "productCode2": "",
  "productCode3": "",
  "contractName": "Liability Contract",
  "cbsNumber": "21324556600"
}
```

**Response:**

```json
{
  "success": true,
  "retCode": "0",
  "message": "Success",
  "rawResponse": "XML response from SOAP service"
}
```

## Xử lý lỗi

Trong trường hợp có lỗi, API sẽ trả về response với cấu trúc:

```json
{
  "success": false,
  "retCode": "9999",
  "message": "Error message",
  "details": "Detailed error information if available"
}
```

## Debugging

Tất cả các request và response SOAP đều được log ra console để dễ dàng debug.
