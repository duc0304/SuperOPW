# Backend API cho OpenWay Web Service

Backend API này cung cấp các endpoint để tương tác với OpenWay Web Service thông qua SOAP API.

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` với nội dung:

```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=Way4_DB
DB_PORT=5432
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400

# Oracle Database Configuration
ORACLE_HOST=10.145.48.96
ORACLE_PORT=1521
ORACLE_SERVICE_NAME=way4db
ORACLE_USER=INT
ORACLE_PASSWORD=your_password
```

## Khởi động

```bash
npm start
```

Hoặc chế độ development:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất (yêu cầu xác thực)

### Customers

- `GET /api/customers` - Lấy danh sách khách hàng
- `GET /api/customers/:id` - Lấy thông tin khách hàng theo ID
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/:id` - Cập nhật thông tin khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Oracle Clients

- `GET /api/oracle/clients` - Lấy danh sách clients từ Oracle database

## Yêu cầu hệ thống

- Node.js >= 14.x
- PostgreSQL
- Oracle Instant Client (cho kết nối Oracle)

## Cài đặt Oracle Instant Client

Để sử dụng module oracledb, bạn cần cài đặt Oracle Instant Client:

### Windows

1. Tải Oracle Instant Client từ [Oracle website](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)
2. Giải nén vào thư mục (ví dụ: `C:\oracle\instantclient_19_11`)
3. Thêm đường dẫn vào biến môi trường PATH
4. Khởi động lại máy tính

### Linux

```bash
sudo apt-get install libaio1
sudo mkdir -p /opt/oracle
cd /opt/oracle
sudo unzip /path/to/instantclient-basic-linux.x64-19.11.0.0.0.zip
sudo sh -c "echo /opt/oracle/instantclient_19_11 > /etc/ld.so.conf.d/oracle-instantclient.conf"
sudo ldconfig
```

### macOS

```bash
cd ~/Downloads
unzip instantclient-basic-macos.x64-19.8.0.0.0dbru.zip
mkdir -p ~/lib
mv instantclient_19_8 ~/lib/
cd ~/lib/instantclient_19_8
xattr -d com.apple.quarantine *
```

## Lưu ý

- Đảm bảo rằng Oracle Instant Client đã được cài đặt đúng cách
- Kiểm tra thông tin kết nối Oracle trong file .env
- Đảm bảo rằng người dùng Oracle có quyền truy cập vào bảng CLIENT

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
