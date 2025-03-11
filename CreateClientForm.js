import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CreateClientForm = () => {
  const [formData, setFormData] = useState({
    institutionCode: '0101',
    branch: '001',
    clientTypeCode: 'PR',
    shortName: '',
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    birthDate: '',
    identityCardNumber: '',
    mobilePhone: '',
    email: '',
    addressLine1: '',
    city: '',
    salutationCode: 'MR',
    maritalStatusCode: '',
    citizenship: 'VNM',
    customData: [
      { addInfoType: 'AddInfo01', tagName: 'DefaultTag', tagValue: 'DefaultValue' }
    ]
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomDataChange = (index, field, value) => {
    const updatedCustomData = [...formData.customData];
    updatedCustomData[index] = {
      ...updatedCustomData[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      customData: updatedCustomData
    }));
  };

  const addCustomData = () => {
    setFormData(prev => ({
      ...prev,
      customData: [
        ...prev.customData,
        { addInfoType: 'AddInfo01', tagName: '', tagValue: '' }
      ]
    }));
  };

  const removeCustomData = (index) => {
    if (formData.customData.length <= 1) return;
    
    const updatedCustomData = [...formData.customData];
    updatedCustomData.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      customData: updatedCustomData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Gọi API backend
      const result = await axios.post('http://localhost:5000/api/createClient', formData);
      setResponse(result.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <Card.Header>Thông tin khách hàng</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Institution Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="institutionCode" 
                    value={formData.institutionCode} 
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Client Type Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="clientTypeCode" 
                    value={formData.clientTypeCode} 
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Short Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="shortName" 
                    value={formData.shortName} 
                    onChange={handleChange}
                    placeholder="Họ tên đầy đủ"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    placeholder="Tên"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="middleName" 
                    value={formData.middleName} 
                    onChange={handleChange}
                    placeholder="Tên đệm"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    placeholder="Họ"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="birthDate" 
                    value={formData.birthDate} 
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Salutation</Form.Label>
                  <Form.Select 
                    name="salutationCode" 
                    value={formData.salutationCode} 
                    onChange={handleChange}
                  >
                    <option value="MR">Mr</option>
                    <option value="MRS">Mrs</option>
                    <option value="MS">Ms</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select 
                    name="maritalStatusCode" 
                    value={formData.maritalStatusCode} 
                    onChange={handleChange}
                  >
                    <option value="">Chọn tình trạng hôn nhân</option>
                    <option value="S">Độc thân</option>
                    <option value="M">Đã kết hôn</option>
                    <option value="D">Ly hôn</option>
                    <option value="W">Góa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Citizenship</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="citizenship" 
                    value={formData.citizenship} 
                    onChange={handleChange}
                    placeholder="Quốc tịch (VNM)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Identity Card Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="identityCardNumber" 
                    value={formData.identityCardNumber} 
                    onChange={handleChange}
                    placeholder="Số CMND/CCCD"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="mobilePhone" 
                    value={formData.mobilePhone} 
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="addressLine1" 
                    value={formData.addressLine1} 
                    onChange={handleChange}
                    placeholder="Địa chỉ"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    placeholder="Thành phố"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Card className="mb-3">
              <Card.Header>Custom Data (Bắt buộc)</Card.Header>
              <Card.Body>
                {formData.customData.map((item, index) => (
                  <Row key={index} className="mb-3 align-items-end">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Add Info Type</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={item.addInfoType} 
                          onChange={(e) => handleCustomDataChange(index, 'addInfoType', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Tag Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={item.tagName} 
                          onChange={(e) => handleCustomDataChange(index, 'tagName', e.target.value)}
                          placeholder="Tên tag"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Tag Value</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={item.tagValue} 
                          onChange={(e) => handleCustomDataChange(index, 'tagValue', e.target.value)}
                          placeholder="Giá trị tag"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => removeCustomData(index)}
                        disabled={formData.customData.length <= 1}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" size="sm" onClick={addCustomData}>
                  Thêm Custom Data
                </Button>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2 mt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Tạo khách hàng'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mt-3">
          <strong>Lỗi:</strong> {error}
        </Alert>
      )}

      {response && (
        <Card className="mt-3">
          <Card.Header>Kết quả</Card.Header>
          <Card.Body>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CreateClientForm;