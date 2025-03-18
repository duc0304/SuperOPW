'use client';

import { useState, useEffect } from 'react';
import { RiRefreshLine, RiFileDownloadLine, RiUserAddLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ClientTable from '../clients/components/ClientTable';
import type { Client } from '@/redux/slices/clientSlice';

interface Customer {
  id: string;
  companyName: string;
  shortName: string;
  clientNumber: string;
  cityzenship: string;
  dateOpen: string | null;
  status: string;
}

export default function TestPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/oracle/clients');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCustomers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const exportToCSV = () => {
    if (customers.length === 0) return;
    
    const headers = Object.keys(customers[0]).join(',');
    const csvData = customers.map(customer => 
      Object.values(customer).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${csvData}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'oracle_clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToCustomers = async () => {
    try {
      localStorage.setItem('importedOracleCustomers', JSON.stringify(customers));
      toast.success(`${customers.length} customers ready to import. Redirecting...`);
      setTimeout(() => {
        router.push('/clients');
      }, 1500);
    } catch (error) {
      console.error('Error saving customers:', error);
      toast.error('Failed to prepare customers for import');
    }
  };

  // Handlers for ClientTable
  const handleEdit = (client: Client) => {
    toast.success(`Edit client: ${client.companyName}`);
  };

  const handleDelete = (client: Client) => {
    toast.success(`Delete client: ${client.companyName}`);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Oracle Clients Test Page</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <RiRefreshLine className="mr-2" />
            Refresh
          </button>
          
          <button 
            onClick={exportToCSV}
            disabled={customers.length === 0 || loading}
            className={`px-4 py-2 rounded-lg flex items-center ${
              customers.length === 0 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 transition-colors'
            }`}
          >
            <RiFileDownloadLine className="mr-2" />
            Export CSV
          </button>
          
          <button 
            onClick={saveToCustomers}
            disabled={customers.length === 0 || loading}
            className={`px-4 py-2 rounded-lg flex items-center ${
              customers.length === 0 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600 transition-colors'
            }`}
          >
            <RiUserAddLine className="mr-2" />
            Import to Clients
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
          <p className="font-medium">Error: {error}</p>
          <p className="mt-2">Please check your connection to the backend server and try again.</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Clients Found</h3>
          <p className="text-gray-500">There are no clients available in the database.</p>
        </div>
      ) : (
        <>
          <ClientTable 
            clients={currentCustomers as Client[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {indexOfLastItem > customers.length ? customers.length : indexOfLastItem}
              </span>{' '}
              of <span className="font-medium">{customers.length}</span> results
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === number
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 