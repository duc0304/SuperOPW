'use client';

import { useState } from 'react';
import { RiArrowRightSLine, RiFileTextLine, RiSearchLine } from 'react-icons/ri';
import clsx from 'clsx';
import { ContractNode } from '../types';

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

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderNode = (node: ContractNode, level = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div 
          className={clsx(
            'flex items-center h-10 px-3 cursor-pointer rounded-lg transition-colors',
            'hover:bg-gray-50 dark:hover:bg-gray-700/50',
            isSelected && 'bg-primary-50 dark:bg-indigo-900/30 text-primary-700 dark:text-indigo-200',
            level === 0 ? '' : level === 1 ? 'ml-6' : 'ml-12'
          )}
          onClick={() => onSelect(node)}
        >
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
          >
            <RiArrowRightSLine 
              className={clsx(
                'w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
          <RiFileTextLine className={clsx(
            'w-4 h-4 ml-1',
            node.type === 'liability' ? 'text-primary-600 dark:text-indigo-400' :
            node.type === 'issuing' ? 'text-secondary-600 dark:text-indigo-300' :
            'text-green-600 dark:text-green-400'
          )} />
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-indigo-100">{node.title}</span>
        </div>
        
        {isExpanded && node.children && (
          <div>
            {node.children.map((child: ContractNode) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 p-4 h-[calc(100vh-180px)] overflow-y-auto">
      <div className="mb-4">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-indigo-300" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-indigo-500/50 dark:bg-gray-700/70 dark:placeholder-indigo-300/50"
          />
        </div>
      </div>
      <div className="space-y-1">
        {contracts.map(contract => renderNode(contract))}
      </div>
    </div>
  );
}