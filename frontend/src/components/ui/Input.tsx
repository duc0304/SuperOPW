import React, { forwardRef } from 'react';
import { IconType } from 'react-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: IconType;
  rightIcon?: IconType;
  onRightIconClick?: () => void;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg transition-all duration-200
              ${LeftIcon ? 'pl-10' : 'pl-4'} 
              ${RightIcon ? 'pr-10' : 'pr-4'} 
              py-2.5
              ${error 
                ? 'border border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-600 dark:focus:ring-rose-900/30' 
                : 'border border-primary-300 dark:border-primary-700 focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-800/30'
              }
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2
              disabled:opacity-70 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {RightIcon && (
            <div 
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${onRightIconClick ? 'cursor-pointer' : ''}`}
              onClick={onRightIconClick}
            >
              <RightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={`mt-1 text-sm ${error ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
