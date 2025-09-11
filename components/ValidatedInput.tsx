import React from 'react';
import ValidationFeedback from './ValidationFeedback';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string[];
  warnings?: string[];
  isValid?: boolean;
  required?: boolean;
  helpText?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  errors = [],
  warnings = [],
  isValid,
  required = false,
  helpText,
  className = '',
  ...props
}) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const showSuccess = isValid && !hasErrors && !hasWarnings;

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${hasErrors 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : hasWarnings 
        ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500'
        : showSuccess
          ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
          : 'border-gray-300'
    }
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        className={inputClasses}
        {...props}
      />
      
      {helpText && !hasErrors && !hasWarnings && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      <ValidationFeedback
        errors={errors}
        warnings={warnings}
        isValid={showSuccess}
      />
    </div>
  );
};

export default ValidatedInput;
