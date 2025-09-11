import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationFeedbackProps {
  errors: string[];
  warnings: string[];
  isValid?: boolean;
  className?: string;
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  errors,
  warnings,
  isValid,
  className = ''
}) => {
  if (errors.length === 0 && warnings.length === 0 && isValid !== false) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Errors */}
      {errors.length > 0 && (
        <div className="flex items-start gap-2 text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-sm">{error}</p>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="flex items-start gap-2 text-yellow-600">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            {warnings.map((warning, index) => (
              <p key={index} className="text-sm">{warning}</p>
            ))}
          </div>
        </div>
      )}

      {/* Success indicator */}
      {isValid && errors.length === 0 && warnings.length === 0 && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <p className="text-sm">Looks good!</p>
        </div>
      )}
    </div>
  );
};

export default ValidationFeedback;
