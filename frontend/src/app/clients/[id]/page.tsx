'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiFileTextLine, RiBuildingLine, RiUserLine, RiCalendarLine, RiEditLine, RiInformationLine, RiListCheck2, RiShieldUserLine, RiBarChartBoxLine, RiMapPinLine, RiPhoneLine, RiMailLine, RiSaveLine, RiCloseLine } from 'react-icons/ri';
import Link from 'next/link';
import EditClientModal from '../components/EditClientModal';
import Button from '@/components/ui/Button';
import { Client } from '@/redux/slices/clientSlice';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';

interface ExtendedClient extends Client {
  FIRST_NAM?: string;
  LAST_NAM?: string;
  FATHER_S_NAM?: string;
  BIRTH_DATE?: string;
  GENDER?: string;
  PROFESSION?: string;
  CITY?: string;
  ADDRESS_LINE_1?: string;
  ADDRESS_LINE_2?: string;
  ADDRESS_LINE_3?: string;
  PHONE_H?: string;
  E_MAIL?: string;
  ID?: string;
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // State for client data
  const [client, setClient] = useState<ExtendedClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateBackground, setAnimateBackground] = useState(false);

  // Thêm state cho edit mode trực tiếp
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<ExtendedClient | null>(null);

  // Animation effect on mount
  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  // Fetch client data
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!params.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/oracle/clients/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setClient(data.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch client details');
        console.error('Error fetching client details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [params.id]);

  // Xử lý chuyển đổi sang chế độ chỉnh sửa
  const handleEnterEditMode = () => {
    // Đảm bảo sao chép tất cả trường dữ liệu, bao gồm cả CLIENT_ID
    setEditedClient({
      ...client!, 
      id: client!.id,
      ID: client!.ID // Đảm bảo CLIENT_ID được giữ nguyên
    });
    setIsEditMode(true);
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedClient(null);
  };

  // Xử lý thay đổi giá trị
  const handleInputChange = (field: keyof ExtendedClient, value: string) => {
    if (editedClient) {
      setEditedClient({...editedClient, [field]: value});
    }
  };

  // Xử lý lưu thay đổi
  const handleSaveChanges = async () => {
    if (!editedClient) return;
    
    try {
      // Cập nhật trạng thái loading
      setLoading(true);
      
      // Gọi API để cập nhật thông tin client
      const response = await fetch('http://localhost:5000/api/soap/editClient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedClient),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Cập nhật state client với dữ liệu mới
        setClient(editedClient);
        setIsEditMode(false);
        toast.success('Client updated successfully');
      } else {
        // Hiển thị thông báo lỗi
        toast.error(`Failed to update client: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Format date to display in a user-friendly format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl font-semibold p-8 bg-white rounded-xl shadow-md border border-red-200">
          {error || 'Client not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Client Header with gradient background */}
        <div className="mb-6 overflow-visible">
          <div className={`bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
            rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all duration-700 ease-out
            ${animateBackground ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}`}>
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
            
      {/* Decorative elements */}
            <div className="absolute right-10 bottom-10 w-20 h-20 border-4 border-primary-300/30 rounded-xl rotate-12"></div>
            <div className="absolute left-1/3 top-10 w-6 h-6 bg-primary-300/40 rounded-full"></div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div className="flex items-center">
                {/* Back button */}
                <Link href="/clients">
                  <button className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg transform transition-transform hover:scale-105 duration-300">
                    <RiArrowLeftLine className="h-6 w-6 text-white" />
          </button>
                </Link>
          
              <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-md">{client.shortName}</h1>
                  <p className="text-primary-100 dark:text-primary-200">Company: {client.companyName}</p>
                  
                  <div className="flex mt-2 space-x-3">
                    <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white">
                    ID: {client.id}
                  </span>
                    <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white">
                    {client.clientNumber}
                  </span>
                  </div>
                </div>
              </div>
              
            <div className="mt-4 md:mt-0 flex items-center">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium mr-4 ${
                client.status === 'active' 
                    ? 'bg-emerald-500/50 backdrop-blur-sm text-white' 
                    : 'bg-rose-500/50 backdrop-blur-sm text-white'
              }`}>
                  <span className={`h-2 w-2 rounded-full mr-2 ${
                    client.status === 'active' ? 'bg-white animate-pulse' : 'bg-white'
                }`}></span>
                {client.status === 'active' ? 'Active' : 'Inactive'}
              </span>
                
                {/* Thay đổi nút Edit/Save */}
                {isEditMode ? (
                  <>
                    <Button
                      onClick={handleSaveChanges}
                      variant="primary"
                      icon={RiSaveLine}
                      className="px-6 py-2.5 mr-2"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className="px-6 py-2.5"
                      icon={RiCloseLine}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
              <Button
                    onClick={handleEnterEditMode}
                variant="primary"
                icon={RiEditLine}
                    className="px-6 py-2.5"
              >
                Edit
              </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid layout for details - dưới đây cần sửa để hiển thị Input khi ở chế độ edit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Company Information Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiBuildingLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Company Information</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Client ID */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border-2 border-indigo-300 dark:border-indigo-600/50 shadow-md">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm font-semibold">Client ID (Database)</label>
                <p className="font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg inline-block">
                  {client.ID || 'N/A'}
                </p>
                </div>
              
              {/* Company Name */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Company Name</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.companyName || 'N/A'}</p>
                )}
                </div>
              
              {/* Tương tự làm cho các trường khác - chỉ cần thay thế phần hiển thị tương tự */}
              {/* Short Name */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Short Name</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.shortName || ''}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.shortName || 'N/A'}</p>
                )}
                </div>
              
              {/* Client Number - chỉ đọc, không cho phép chỉnh sửa */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border-2 border-indigo-300 dark:border-indigo-600/50 shadow-md">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm font-semibold">Client Number (Unique ID)</label>
                <p className="font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg inline-block">
                  {client.clientNumber || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                  This field cannot be modified as it serves as a unique identifier for the client.
                </p>
              </div>

              {/* Các trường khác tương tự */}
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiUserLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* First Name */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">First Name</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.FIRST_NAM || ''}
                    onChange={(e) => handleInputChange('FIRST_NAM', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.FIRST_NAM || 'N/A'}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Last Name</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.LAST_NAM || ''}
                    onChange={(e) => handleInputChange('LAST_NAM', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.LAST_NAM || 'N/A'}</p>
                )}
              </div>
              
              {/* Father's Name */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Father's Name</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.FATHER_S_NAM || ''}
                    onChange={(e) => handleInputChange('FATHER_S_NAM', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.FATHER_S_NAM || 'N/A'}</p>
                )}
              </div>
              
              {/* Birth Date */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Date of Birth</label>
                {isEditMode ? (
                  <Input
                    type="date"
                    value={editedClient?.BIRTH_DATE?.split('T')[0] || ''}
                    onChange={(e) => handleInputChange('BIRTH_DATE', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(client.BIRTH_DATE)}</p>
                )}
                </div>
              
              {/* Gender */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Gender</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.GENDER || ''}
                    onChange={(e) => handleInputChange('GENDER', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.GENDER || 'N/A'}</p>
                )}
                </div>
              
              {/* Profession */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Profession</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.PROFESSION || ''}
                    onChange={(e) => handleInputChange('PROFESSION', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.PROFESSION || 'N/A'}</p>
                )}
                </div>
              
              {/* Citizenship */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Citizenship</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.cityzenship || ''}
                    onChange={(e) => handleInputChange('cityzenship', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.cityzenship || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiMapPinLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* City */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">City</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.CITY || ''}
                    onChange={(e) => handleInputChange('CITY', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.CITY || 'N/A'}</p>
                )}
                </div>
              
              {/* Address Line 1 */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Address Line 1</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.ADDRESS_LINE_1 || ''}
                    onChange={(e) => handleInputChange('ADDRESS_LINE_1', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.ADDRESS_LINE_1 || 'N/A'}</p>
                )}
                </div>
              
              {/* Address Line 2 */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Address Line 2</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.ADDRESS_LINE_2 || ''}
                    onChange={(e) => handleInputChange('ADDRESS_LINE_2', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.ADDRESS_LINE_2 || 'N/A'}</p>
                )}
                </div>
              
              {/* Address Line 3 */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Address Line 3</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.ADDRESS_LINE_3 || ''}
                    onChange={(e) => handleInputChange('ADDRESS_LINE_3', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{client.ADDRESS_LINE_3 || 'N/A'}</p>
                )}
              </div>
              
              {/* Phone */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Phone</label>
                {isEditMode ? (
                  <Input
                    value={editedClient?.PHONE_H || ''}
                    onChange={(e) => handleInputChange('PHONE_H', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white flex items-center">
                    <RiPhoneLine className="mr-2 text-primary-500" />
                    {client.PHONE_H || 'N/A'}
                  </p>
                )}
        </div>

              {/* Email */}
              <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl hover:bg-white/80 transition-all duration-300 border border-indigo-200 dark:border-indigo-700/30">
                <label className="text-gray-500 dark:text-gray-400 block mb-1 text-sm">Email</label>
                {isEditMode ? (
                  <Input
                    type="email"
                    value={editedClient?.E_MAIL || ''}
                    onChange={(e) => handleInputChange('E_MAIL', e.target.value)}
                    className="py-2 px-3 w-full bg-white/90 dark:bg-gray-700/70 border-purple-300 focus:border-primary-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white flex items-center">
                    <RiMailLine className="mr-2 text-primary-500" />
                    {client.E_MAIL || 'N/A'}
                  </p>
                )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}