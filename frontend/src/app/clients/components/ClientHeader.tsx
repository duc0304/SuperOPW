import { useState, useEffect, FormEvent, useRef } from 'react';
import { RiAddLine, RiSearchLine, RiUserLine, RiRefreshLine, RiMenuLine } from 'react-icons/ri';
import type { StatusFilter, Client } from '@/redux/slices/clientSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ClientHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (query: string, clientID?: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  totalItems: number;
  isSearching?: boolean;
  allClients?: Client[];
  onRefresh: () => void;
}

export default function ClientHeader({ 
  onAddClick, 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit,
  statusFilter, 
  onStatusChange,
  totalItems,
  isSearching = false,
  allClients = [],
  onRefresh,
}: ClientHeaderProps) {
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  const getStatusText = (status: StatusFilter): string => {
    switch (status) {
      case 'all':
        return 'All Status';
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      default:
        return 'All Status';
    }
  };

  const toggleStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
    setShowActionMenu(false);
  };

  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
    setShowStatusDropdown(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSearching) {
      onSearchSubmit(searchQuery, undefined);
    }
  };

  return (
    <div className="mb-6 overflow-visible">
      <div className={`
        bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
        rounded-3xl relative overflow-hidden shadow-xl transition-all duration-700 ease-out
        ${animateBackground ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}
        md:p-6 md:pb-24
        p-5 pt-6 pb-6
      `}>
        <div className="md:hidden absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="md:hidden absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="bg-white/20 p-2.5 rounded-xl mr-3 shadow-lg transform transition-transform hover:scale-105 duration-300">
              <RiUserLine className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Clients</h1>
              <p className="text-primary-100 dark:text-primary-200 text-sm md:text-base hidden md:block">Manage your client relationships</p>
              <p className="text-primary-100 dark:text-primary-200 text-xs md:hidden">Manage your relationships</p>
            </div>
          </div>
          
          <div className="md:block hidden">
            <Button 
              onClick={onAddClick}
              variant="primary"
              className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
              icon={RiAddLine}
            >
              Add Client
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              onClick={onAddClick}
              variant="primary"
              className="p-2.5 rounded-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 shadow-md"
            >
              <RiAddLine className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="md:hidden mx-3 mt-3 mb-2">
        <div className="flex items-center space-x-2">
          <form ref={searchFormRef} onSubmit={handleSearchSubmit} className="relative flex-1">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search clients"
                className="py-2 pl-3.5 pr-10 w-full bg-white shadow-sm dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:placeholder-gray-400 rounded-xl transition-all duration-300 focus:border-primary-400 dark:focus:border-primary-500 text-sm"
              />
              {isSearching ? (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary-400 text-white">
                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                </span>
              ) : (
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 shadow-sm"
                  aria-label="Search clients"
                >
                  <RiSearchLine className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>
          
          <button
            onClick={toggleActionMenu}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm"
            aria-label="Options menu"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>
        </div>
        
        {showActionMenu && (
          <div className="absolute right-3 mt-1 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => {
                  onRefresh();
                  setShowActionMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <RiRefreshLine className="mr-2 h-4 w-4 text-primary-500 dark:text-primary-400" />
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`
        hidden md:block
        bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 
        rounded-2xl shadow-2xl mx-6 -mt-16 p-5 relative z-20 border-2 border-purple-200/60 dark:border-purple-500/30 
        transition-all duration-500 hover:shadow-xl overflow-visible
      `}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-indigo-400/30 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-300/30 to-purple-400/30 rounded-full -mb-10 blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-lg"></div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 relative z-10">
          <div className="relative flex-1">
            <form ref={searchFormRef} onSubmit={handleSearchSubmit}>
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search clients by name, cpname or number..."
                  className="py-2.5 pl-10 pr-14 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500 text-base"
                />
                {isSearching ? (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary-400 text-white">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  </span>
                ) : (
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label="Search clients"
                  >
                    <RiSearchLine className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Button 
                onClick={toggleStatusDropdown}
                variant="secondary"
                className={`relative transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50 text-base ${
                  statusFilter === 'active' 
                    ? 'text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/70' 
                    : statusFilter === 'inactive'
                      ? 'text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/70'
                      : statusFilter === 'all'
                        ? 'text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/70'
                      : ''
                }`}
              >
                {getStatusText(statusFilter)}
                <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {showStatusDropdown && (
                <div className="absolute left-0 mt-1 w-40 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/95 z-[9999] overflow-visible border-2 border-purple-200/50 dark:border-purple-700/30 p-1.5 animate-fadeIn">
                  <div className="space-y-1">
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'all' ? 'font-medium' : ''} 
                        bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:shadow-inner
                        ${statusFilter === 'all' ? 'bg-primary-100 dark:bg-primary-800/50 shadow-inner' : ''}`}
                      onClick={() => {
                        onStatusChange('all');
                        setShowStatusDropdown(false);
                      }}
                    >
                      All Status
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'active' ? 'font-medium' : ''} 
                        bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:shadow-inner
                        ${statusFilter === 'active' ? 'bg-emerald-100 dark:bg-emerald-800/50 shadow-inner' : ''}`}
                      onClick={() => {
                        onStatusChange('active');
                        setShowStatusDropdown(false);
                      }}
                    >
                      Active
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'inactive' ? 'font-medium' : ''} 
                        bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:shadow-inner
                        ${statusFilter === 'inactive' ? 'bg-rose-100 dark:bg-rose-800/50 shadow-inner' : ''}`}
                      onClick={() => {
                        onStatusChange('inactive');
                        setShowStatusDropdown(false);
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}