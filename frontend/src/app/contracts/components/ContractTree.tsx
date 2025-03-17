'use client';

import { useState, useEffect } from 'react';
import { RiArrowRightSLine, RiFileTextLine, RiSearchLine, RiFileList3Line, RiExchangeFundsLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import clsx from 'clsx';
import { ContractNode } from '../types';
import Input from '@/components/ui/Input';

interface ContractTreeProps {
  contracts: ContractNode[];
  selectedId: string | null;
  onSelect: (contract: ContractNode) => void;
}

export default function ContractTree({ 
  contracts, 
  selectedId, 
  onSelect 
}: ContractTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [animatedNodes, setAnimatedNodes] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Animation effect on mount
  useEffect(() => {
    const animationDelay = 50; // ms between each row animation
    
    const animateNodesRecursively = (nodes: ContractNode[], level = 0, delay = 0) => {
      nodes.forEach((node, index) => {
        const currentDelay = delay + index * animationDelay;
        
        setTimeout(() => {
          setAnimatedNodes(prev => ({
            ...prev,
            [node.id]: true
          }));
          
          // Không tự động mở rộng các node cấp cao nhất nữa
          // if (level === 0) {
          //   setExpandedIds(prev => new Set([...prev, node.id]));
          // }
          
          // Chỉ animate các node con nếu node cha đã được mở rộng
          if (node.children && node.children.length > 0 && expandedIds.has(node.id)) {
            animateNodesRecursively(node.children, level + 1, currentDelay + animationDelay);
          }
        }, currentDelay);
      });
    };
    
    animateNodesRecursively(contracts);
  }, [contracts, expandedIds]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Get icon based on contract type
  const getContractIcon = (type: string) => {
    switch (type) {
      case 'liability':
        return <RiFileList3Line className="w-5 h-5" />;
      case 'issuing':
        return <RiExchangeFundsLine className="w-5 h-5" />;
      case 'card':
        return <RiMoneyDollarCircleLine className="w-5 h-5" />;
      default:
        return <RiFileTextLine className="w-5 h-5" />;
    }
  };

  // Get icon color based on contract type
  const getIconColor = (type: string) => {
    switch (type) {
      case 'liability':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'issuing':
        return 'text-purple-600 dark:text-purple-400';
      case 'card':
        return 'text-emerald-600 dark:text-emerald-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get icon background based on contract type
  const getIconBackground = (type: string) => {
    switch (type) {
      case 'liability':
        return 'bg-indigo-100 dark:bg-indigo-900/30';
      case 'issuing':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'card':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50';
    }
  };

  const renderNode = (node: ContractNode, level = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isAnimated = animatedNodes[node.id];
    const isCard = node.type === 'card';
    
    // Skip rendering if doesn't match search query
    if (searchQuery && !node.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      // But check if any children match
      if (hasChildren) {
        const matchingChildren = node.children!.filter(child => 
          child.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingChildren.length === 0) return null;
      } else {
        return null;
      }
    }

    return (
      <div key={node.id} className={`transition-all duration-500 ease-out ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
        <div 
          className={clsx(
            'group flex items-center px-3 py-2 my-1 cursor-pointer rounded-lg transition-all duration-200',
            'border border-transparent',
            isSelected ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700/50' : 
            'hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700/50',
            level === 0 ? '' : level === 1 ? 'ml-6' : 'ml-12'
          )}
          onClick={() => onSelect(node)}
        >
          {!isCard && (
            <button
              className={`p-1.5 rounded-md mr-2 transition-all duration-200 ${isSelected ? 'bg-primary-200/50 dark:bg-primary-800/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={(e) => toggleExpand(node.id, e)}
            >
              <RiArrowRightSLine 
                className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  isExpanded ? 'rotate-90 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                )}
              />
            </button>
          )}
          
          {isCard && <div className="w-7"></div>}
          
          <div className={`p-1.5 rounded-md mr-3 ${getIconBackground(node.type)}`}>
            <div className={getIconColor(node.type)}>
              {getContractIcon(node.type)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 truncate font-medium text-gray-900 dark:text-white">
            {node.title}
          </div>
          
          {hasChildren && (
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {node.children!.length}
            </div>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {node.children!.map((child: ContractNode) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-[calc(100vh-250px)] md:h-[calc(100vh-180px)]">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-xl -z-10"></div>
      
      <div className="p-4 flex flex-col h-full">
        <div className="mb-4 relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts..."
            className="pl-10 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
          />
        </div>
        
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          <div className="space-y-1">
            {contracts.length > 0 ? (
              contracts.map(contract => renderNode(contract))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No contracts found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}