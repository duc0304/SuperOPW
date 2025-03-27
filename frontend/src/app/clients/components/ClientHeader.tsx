import { useState, useEffect, FormEvent, KeyboardEvent, useRef } from 'react';
import { RiAddLine, RiSearchLine, RiUserLine, RiSortAsc, RiRefreshLine, RiMenuLine } from 'react-icons/ri';
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
  onSortToggle: () => void; // Thêm prop để xử lý sort
  onRefresh: () => void; // Thêm prop để xử lý refresh
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
  onSortToggle,
  onRefresh,
}: ClientHeaderProps) {
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [suggestions, setSuggestions] = useState<Client[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJustSelected(false);
    onSearchChange(e);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0 && allClients.length > 0) {
      const query = searchQuery.toLowerCase();
      const filteredSuggestions = allClients.filter(client => 
        (client.companyName && client.companyName.toLowerCase().includes(query)) ||
        (client.shortName && client.shortName.toLowerCase().includes(query)) ||
        (client.clientNumber && client.clientNumber.toLowerCase().includes(query))
      ).slice(0, 3);
      
      const inputElement = searchFormRef.current?.querySelector('input');
      const isFocused = document.activeElement === inputElement;
      
      setSuggestions(filteredSuggestions);
      
      if (justSelected) {
        setShowSuggestions(false);
        setJustSelected(false);
      } else if (isFocused && filteredSuggestions.length > 0) {
        setShowSuggestions(true);
      } else if (!isFocused) {
        setShowSuggestions(false);
      }
    } else {
      forceClearSuggestions();
    }
  }, [searchQuery, allClients]);

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
    setShowSuggestions(false);
    setShowActionMenu(false);
  };

  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
    setShowStatusDropdown(false);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    forceClearSuggestions();
    if (!isSearching) {
      onSearchSubmit(searchQuery, undefined);
    }
  };

  const handleSelectSuggestion = (client: Client) => {
    const value = client.shortName || client.companyName || '';
    forceClearSuggestions();
    handleSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    onSearchSubmit(value, client.ID);
    const inputElement = searchFormRef.current?.querySelector('input');
    if (inputElement) {
      inputElement.blur();
    }
  };

  const forceClearSuggestions = () => {
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    setJustSelected(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
        forceClearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    
    const handleEscKey = (e: Event) => {
      if (((e as unknown) as KeyboardEvent).key === 'Escape') {
        forceClearSuggestions();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (suggestions.length > 0 && document.activeElement === searchFormRef.current?.querySelector('input')) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (!showSuggestions || activeSuggestionIndex === -1)) {
      return;
    }
    
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex => 
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      const selectedClient = suggestions[activeSuggestionIndex];
      const value = selectedClient.shortName || selectedClient.companyName || '';
      forceClearSuggestions();
      handleSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
      onSearchSubmit(value, selectedClient.ID);
      const inputElement = searchFormRef.current?.querySelector('input');
      if (inputElement) {
        inputElement.blur();
      }
    }
    else if (e.key === 'Escape') {
      forceClearSuggestions();
    }
  };

  return (
    <div className="mb-6 overflow-visible">
      {/* Header Section */}
      <div className={`
        bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
        rounded-3xl relative overflow-hidden shadow-xl transition-all duration-700 ease-out
        ${animateBackground ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}
        md:p-6 md:pb-24
        p-5 pt-6 pb-6
      `}>
        {/* Hiệu ứng trang trí trên mobile (đơn giản hơn nhưng vẫn đẹp) */}
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
          
          {/* Nút Add Client */}
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
      
      {/* Search Section - Mobile */}
      <div className="md:hidden mx-3 mt-3 mb-2">
        <div className="flex items-center space-x-2">
          <form ref={searchFormRef} onSubmit={handleSearchSubmit} onClick={handleFormClick} className="relative flex-1">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search clients"
                className="py-2 pl-3.5 pr-10 w-full bg-white shadow-sm dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:placeholder-gray-400 rounded-xl transition-all duration-300 focus:border-primary-400 dark:focus:border-primary-500 text-sm"
                onFocus={() => {
                  if (justSelected) {
                    setShowSuggestions(false);
                    setJustSelected(false);
                  } else if (searchQuery && searchQuery.trim().length >= 1) {
                    const query = searchQuery.toLowerCase();
                    const filteredSuggestions = allClients.filter(client => 
                      (client.companyName && client.companyName.toLowerCase().includes(query)) ||
                      (client.shortName && client.shortName.toLowerCase().includes(query)) ||
                      (client.clientNumber && client.clientNumber.toLowerCase().includes(query))
                    ).slice(0, 3);
                    
                    if (filteredSuggestions.length > 0) {
                      setSuggestions(filteredSuggestions);
                      setShowSuggestions(true);
                    } else {
                      forceClearSuggestions();
                    }
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchFormRef.current?.contains(document.activeElement)) {
                      forceClearSuggestions();
                    }
                  }, 200);
                }}
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
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <ul>
                  {suggestions.map((client, index) => (
                    <li 
                      key={client.ID} 
                      className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center transition-colors duration-200 ${
                        index === activeSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectSuggestion(client);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onMouseEnter={() => setActiveSuggestionIndex(index)}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center text-white font-medium shadow-sm">
                        {client.shortName ? client.shortName.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{client.shortName || 'N/A'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{client.companyName || 'N/A'}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          
          {/* Menu Button for mobile */}
          <button
            onClick={toggleActionMenu}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm"
            aria-label="Options menu"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>
        </div>
        
        {/* Mobile Action Menu */}
        {showActionMenu && (
          <div className="absolute right-3 mt-1 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-800 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => {
                  onSortToggle();
                  setShowActionMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <RiSortAsc className="mr-2 h-4 w-4 text-primary-500 dark:text-primary-400" />
                Sort by Date
              </button>
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

      {/* Search Section - Desktop */}
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
            <form ref={searchFormRef} onSubmit={handleSearchSubmit} onClick={handleFormClick}>
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                placeholder="Search clients by name, cpname or number..."
                  className="py-2.5 pl-10 pr-14 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500 text-base"
                  onFocus={() => {
                    if (justSelected) {
                      setShowSuggestions(false);
                      setJustSelected(false);
                    } else if (searchQuery && searchQuery.trim().length >= 1) {
                      const query = searchQuery.toLowerCase();
                      const filteredSuggestions = allClients.filter(client => 
                        (client.companyName && client.companyName.toLowerCase().includes(query)) ||
                        (client.shortName && client.shortName.toLowerCase().includes(query)) ||
                        (client.clientNumber && client.clientNumber.toLowerCase().includes(query))
                      ).slice(0, 3);
                      
                      if (filteredSuggestions.length > 0) {
                        setSuggestions(filteredSuggestions);
                        setShowSuggestions(true);
                      } else {
                        forceClearSuggestions();
                      }
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!searchFormRef.current?.contains(document.activeElement)) {
                        forceClearSuggestions();
                      }
                    }, 200);
                  }}
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
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-purple-200 dark:border-purple-700/50 z-50 overflow-hidden">
                  <ul>
                    {suggestions.map((client, index) => (
                      <li 
                        key={client.ID} 
                        className={`px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer flex items-center transition-colors duration-200 ${
                          index === activeSuggestionIndex ? 'bg-purple-100 dark:bg-purple-900/30' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectSuggestion(client);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                      >
                        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center text-white font-medium shadow-sm">
                          {client.shortName ? client.shortName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900 dark:text-white text-base">{client.shortName || 'N/A'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{client.companyName || 'N/A'} • {client.clientNumber || 'N/A'}</div>
                        </div>
                      </li>
                    ))}
                    <li className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                      Use ↑↓ keys to navigate and Enter to select
                    </li>
                  </ul>
            </div>
              )}
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