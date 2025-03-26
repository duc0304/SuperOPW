import { useState, useEffect } from 'react';
import type { Client } from '@/redux/slices/clientSlice';
import { RiEyeLine, RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export default function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [animatedRows, setAnimatedRows] = useState<{ [key: string]: boolean }>({});
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    const animationDelay = 50;
    clients.forEach((client, index) => {
      setTimeout(() => {
        setAnimatedRows(prev => ({
          ...prev,
          [client.ID]: true,
        }));
      }, index * animationDelay);
    });
  }, [clients]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'inactive':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getInitial = (client: Client) => {
    if (client.shortName && client.shortName.trim().length > 0) {
      return client.shortName.charAt(0).toUpperCase();
    } else if (client.companyName && client.companyName.trim().length > 0) {
      return client.companyName.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getStatusGradient = (status: string | undefined) => {
    if (status === 'active') {
      return 'from-emerald-400 to-teal-500';
    } else {
      return 'from-rose-400 to-pink-500';
    }
  };

  const getRowHoverBg = (status: string | undefined) => {
    if (status === 'active') {
      return 'hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10';
    } else {
      return 'hover:bg-rose-50/40 dark:hover:bg-rose-900/10';
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
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

  const columnHeaders = [
    { id: 'shortName', label: 'Short Name', icon: '🏷️' },
    { id: 'companyName', label: 'Company Name', icon: '🏢' },
    { id: 'clientNumber', label: 'Client Number', icon: '🔢' },
    { id: 'cityzenship', label: 'Citizenship', icon: '🌎' },
    { id: 'dateOpen', label: 'Date Opened', icon: '📅' },
    { id: 'status', label: 'Status', icon: '⭐' },
    { id: 'actions', label: 'Actions', icon: '⚙️' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white dark:bg-gray-800 transition-all duration-300">
      {/* Decorative background elements for desktop */}
      <div className="hidden md:block absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-xl -z-10"></div>
      <div className="hidden md:block absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-xl -z-10"></div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden md:block overflow-x-auto relative">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          <thead className="bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 dark:from-gray-800/90 dark:via-purple-900/20 dark:to-gray-800/90 transition-colors duration-300 sticky top-0 z-10">
            <tr className="shadow-sm">
              {columnHeaders.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-medium tracking-wider transition-all duration-300 ${
                    column.id === 'actions' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex ${column.id === 'actions' ? 'justify-end' : 'items-center'} space-x-1.5`}>
                    <span className="inline-block w-5 text-center opacity-70">{column.icon}</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 font-semibold uppercase">
                      {column.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 transition-colors duration-200">
            {clients.map((client, index) => (
              <tr
                key={`${client.ID}-${index}`}
                className={`
                  transition-all duration-500 ease-out
                  ${getRowHoverBg(client?.status)}
                  ${hoveredRow === client.ID ? 'shadow-md dark:shadow-gray-900/50 z-10 scale-[1.01] relative' : ''}
                  ${animatedRows[client.ID] ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}
                `}
                onMouseEnter={() => setHoveredRow(client.ID)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                      {getInitial(client)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{client?.shortName || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{client?.companyName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-lg inline-block shadow-sm">{client?.clientNumber || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 px-3 py-1 rounded-lg inline-block shadow-sm">{client?.cityzenship || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full inline-block text-center shadow-sm">{formatDate(client?.dateOpen)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-lg inline-flex items-center bg-gradient-to-r ${getStatusGradient(client?.status)} text-white shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 mr-1.5 animate-pulse"></span>
                    {client?.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap transition-colors text-right border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-end items-center space-x-3">
                    <Link href={`/clients/${client.ID}`}>
                      <button
                        className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
                        aria-label="View client details"
                      >
                        <RiEyeLine className="w-5 h-5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => onDelete(client)}
                      className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-800/50 text-rose-600 dark:text-rose-400 transition-colors duration-200"
                      aria-label="Delete client"
                    >
                      <RiDeleteBin6Line className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="space-y-1.5 p-2">
          {clients.map((client, index) => (
            <div
              key={`${client.ID}-${index}`}
              className={`
                rounded-lg shadow-sm p-2.5 bg-purple-50 dark:bg-purple-900/20
                transition-all duration-300 ease-out transform
                ${animatedRows[client.ID] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                active:scale-95 active:shadow-lg
              `}
            >
              <div className="flex justify-between">
                {/* Phần bên trái: Avatar và thông tin */}
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center text-white font-medium shadow-sm">
                      {getInitial(client)}
                    </div>
                    <div className="ml-2 flex flex-col">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                          {client?.shortName || 'N/A'}
                        </span>
                        <div className={`ml-1.5 h-2 w-2 rounded-full animate-pulse ${
                          client?.status === 'active' 
                          ? 'bg-emerald-400' 
                          : 'bg-rose-400'
                        }`}></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {client?.companyName || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 ml-0">
                    <div className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md inline-block shadow-sm">
                      {client?.clientNumber || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Phần bên phải: Actions và date */}
                <div className="flex flex-col items-end">
                  <div className="flex space-x-1">
                    <Link href={`/clients/${client.ID}`}>
                      <button
                        className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400 transition-all duration-200 transform hover:scale-110"
                        aria-label="View client details"
                      >
                        <RiEyeLine className="h-5 w-5" />
                      </button>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(client);
                      }}
                      className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-800/50 text-rose-600 dark:text-rose-400 transition-all duration-200 transform hover:scale-110"
                      aria-label="Delete client"
                    >
                      <RiDeleteBin6Line className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-[10px] font-medium text-gray-600 dark:text-gray-300 text-right whitespace-nowrap mt-1">
                    {formatDate(client?.dateOpen)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}