// Real-time validation utilities
import React, { useEffect } from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  field: string;
  validator: (value: any, formData?: any) => string | null;
  warning?: (value: any, formData?: any) => string | null;
}

// Validation rules for strategy creation
export const strategyValidationRules: ValidationRule[] = [
  {
    field: 'strategyName',
    validator: (value: string) => {
      if (!value || !value.trim()) {
        return 'Strategy name is required';
      }
      if (value.trim().length < 3) {
        return 'Strategy name must be at least 3 characters long';
      }
      if (value.trim().length > 50) {
        return 'Strategy name must be less than 50 characters';
      }
      return null;
    }
  },
  {
    field: 'selectedInstruments',
    validator: (value: string[]) => {
      if (!value || value.length === 0) {
        return 'Please select an instrument';
      }
      // Single instrument selection - no need for upper limit check
      return null;
    }
  },
  {
    field: 'startTime',
    validator: (value: string) => {
      if (!value) {
        return 'Start time is required';
      }
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value)) {
        return 'Please enter a valid time format (HH:MM)';
      }
      return null;
    }
  },
  {
    field: 'squareOff',
    validator: (value: string) => {
      if (!value) {
        return 'Square-off time is required';
      }
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value)) {
        return 'Please enter a valid time format (HH:MM)';
      }
      return null;
    }
  },
  {
    field: 'selectedDays',
    validator: (value: string[]) => {
      if (!value || value.length === 0) {
        return 'Please select at least one trading day';
      }
      return null;
    }
  },
  {
    field: 'maxProfit',
    validator: (value: number) => {
      if (value === undefined || value === null) {
        return 'Maximum profit is required';
      }
      if (value < 0) {
        return 'Maximum profit cannot be negative';
      }
      if (value > 1000000) {
        return 'Maximum profit seems too high (max: 10,00,000)';
      }
      return null;
    },
    warning: (value: number) => {
      if (value > 0 && value < 1000) {
        return 'Consider setting a higher profit target for better returns';
      }
      return null;
    }
  },
  {
    field: 'maxLoss',
    validator: (value: number) => {
      if (value === undefined || value === null) {
        return 'Maximum loss is required';
      }
      if (value < 0) {
        return 'Maximum loss cannot be negative';
      }
      if (value > 1000000) {
        return 'Maximum loss seems too high (max: 10,00,000)';
      }
      return null;
    },
    warning: (value: number, formData?: any) => {
      if (formData?.maxProfit && value > formData.maxProfit) {
        return 'Maximum loss is higher than maximum profit - consider adjusting';
      }
      if (value > 0 && value < 1000) {
        return 'Consider setting a higher loss limit for better risk management';
      }
      return null;
    }
  }
];

// Order leg validation rules
export const orderLegValidationRules: ValidationRule[] = [
  {
    field: 'quantity',
    validator: (value: number) => {
      if (!value || value <= 0) {
        return 'Quantity must be greater than 0';
      }
      if (value > 10000) {
        return 'Quantity seems too high (max: 10,000)';
      }
      return null;
    }
  },
  {
    field: 'strikeValue',
    validator: (value: string) => {
      if (!value || !value.trim()) {
        return 'Strike value is required';
      }
      return null;
    }
  },
  {
    field: 'stopLoss',
    validator: (value: any) => {
      if (!value) {
        return 'Stop loss configuration is required';
      }
      if (value.value === undefined || value.value === null) {
        return 'Stop loss value is required';
      }
      if (value.value < 0) {
        return 'Stop loss value cannot be negative';
      }
      return null;
    }
  },
  {
    field: 'target',
    validator: (value: any) => {
      if (value && value.value !== undefined && value.value !== null) {
        if (value.value < 0) {
          return 'Target value cannot be negative';
        }
      }
      return null;
    }
  }
];

// Indicator condition validation rules
export const indicatorConditionValidationRules: ValidationRule[] = [
  {
    field: 'indicator',
    validator: (value: string) => {
      if (!value || !value.trim()) {
        return 'Please select an indicator';
      }
      return null;
    }
  },
  {
    field: 'comparator',
    validator: (value: string) => {
      if (!value || !value.trim()) {
        return 'Please select a comparator';
      }
      return null;
    }
  },
  {
    field: 'value',
    validator: (value: string) => {
      if (!value || !value.trim()) {
        return 'Please enter a value';
      }
      // Check if value is numeric for numeric indicators
      const numericIndicators = ['SMA', 'EMA', 'RSI', 'MACD'];
      if (numericIndicators.some(ind => value.includes(ind)) && isNaN(Number(value))) {
        return 'Please enter a valid numeric value';
      }
      return null;
    }
  }
];

// Main validation function
export const validateField = (
  field: string,
  value: any,
  formData?: any,
  rules: ValidationRule[] = strategyValidationRules
): ValidationResult => {
  const rule = rules.find(r => r.field === field);
  if (!rule) {
    return { isValid: true, errors: [], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate
  const error = rule.validator(value, formData);
  if (error) {
    errors.push(error);
  }

  // Check for warnings
  if (rule.warning) {
    const warning = rule.warning(value, formData);
    if (warning) {
      warnings.push(warning);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate entire form
export const validateForm = (formData: any, strategyType: string, selectedInstruments?: string[], orderLegs?: any[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic fields
  strategyValidationRules.forEach(rule => {
    let value = formData[rule.field];
    
    // Handle special cases where field names don't match
    if (rule.field === 'selectedInstruments') {
      value = selectedInstruments;
    }
    
    const result = validateField(rule.field, value, formData);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  });

  // Validate strategy-specific fields
  if (strategyType === 'Time Based') {
    const legs = orderLegs || formData.legs || [];
    if (!legs || legs.length === 0) {
      errors.push('Please add at least one order leg for time-based strategy');
    } else {
      legs.forEach((leg: any, index: number) => {
        orderLegValidationRules.forEach(rule => {
          const result = validateField(rule.field, leg[rule.field], leg);
          errors.push(...result.errors.map(err => `Leg ${index + 1}: ${err}`));
          warnings.push(...result.warnings.map(warn => `Leg ${index + 1}: ${warn}`));
        });
      });
    }
  }

  if (strategyType === 'Indicator Based') {
    // Validate entry conditions
    const hasLongConditions = formData.longEntryConditions?.some((condition: any) => 
      condition.indicator && condition.comparator && condition.value
    );
    const hasShortConditions = formData.shortEntryConditions?.some((condition: any) => 
      condition.indicator && condition.comparator && condition.value
    );
    
    if (!hasLongConditions && !hasShortConditions) {
      errors.push('Please configure at least one entry condition (Long or Short)');
    }

    // Validate individual conditions
    [...(formData.longEntryConditions || []), ...(formData.shortEntryConditions || [])].forEach((condition: any, index: number) => {
      if (condition.indicator || condition.comparator || condition.value) {
        indicatorConditionValidationRules.forEach(rule => {
          const result = validateField(rule.field, condition[rule.field], condition);
          errors.push(...result.errors.map(err => `Condition ${index + 1}: ${err}`));
          warnings.push(...result.warnings.map(warn => `Condition ${index + 1}: ${warn}`));
        });
      }
    });

    // Validate option legs
    const legs = orderLegs || formData.legs || [];
    if (!legs || legs.length === 0) {
      errors.push('Please add at least one option leg for indicator-based strategy');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Real-time validation hook
export const useValidation = (formData: any, strategyType: string, selectedInstruments?: string[], orderLegs?: any[]) => {
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});
  const [formValidation, setFormValidation] = React.useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });

  useEffect(() => {
    // Validate individual fields
    const results: Record<string, ValidationResult> = {};
    strategyValidationRules.forEach(rule => {
      let value = formData[rule.field];
      
      // Handle special cases where field names don't match
      if (rule.field === 'selectedInstruments') {
        value = selectedInstruments;
      }
      
      results[rule.field] = validateField(rule.field, value, formData);
    });
    setValidationResults(results);

    // Validate entire form
    const formResult = validateForm(formData, strategyType, selectedInstruments, orderLegs);
    setFormValidation(formResult);
  }, [formData, strategyType, selectedInstruments, orderLegs]);

  return {
    validationResults,
    formValidation,
    isFieldValid: (field: string) => validationResults[field]?.isValid ?? true,
    getFieldErrors: (field: string) => validationResults[field]?.errors ?? [],
    getFieldWarnings: (field: string) => validationResults[field]?.warnings ?? [],
    isFormValid: formValidation.isValid,
    getFormErrors: () => formValidation.errors,
    getFormWarnings: () => formValidation.warnings
  };
};
