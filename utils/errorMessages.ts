// Error message utilities for better user experience

export const getErrorMessage = (error: any): string => {
  // Handle network errors
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (error.message?.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  const status = error.response.status;
  const data = error.response.data;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      return data?.message || 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return data?.message || 'This action conflicts with the current state. Please refresh and try again.';
    case 422:
      if (data?.error && Array.isArray(data.error)) {
        const validationErrors = data.error.map((err: any) => err.message).join(', ');
        return `Validation failed: ${validationErrors}`;
      }
      return data?.message || 'Invalid data provided. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error occurred. Please try again later or contact support.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return data?.message || data?.Message || 'An unexpected error occurred. Please try again.';
  }
};

export const getValidationErrorMessage = (field: string, error: any): string => {
  const messages: Record<string, string> = {
    strategyName: 'Please enter a valid strategy name.',
    instruments: 'Please select at least one instrument.',
    orderType: 'Please select a valid order type.',
    startTime: 'Please enter a valid start time.',
    squareOffTime: 'Please enter a valid square-off time.',
    tradeDays: 'Please select at least one trading day.',
    maxProfit: 'Please enter a valid maximum profit amount.',
    maxLoss: 'Please enter a valid maximum loss amount.',
    quantity: 'Please enter a valid quantity (minimum 1).',
    strikeValue: 'Please enter a valid strike value.',
    stopLoss: 'Please configure stop loss properly.',
    target: 'Please configure target properly.',
    legs: 'Please add at least one order leg.',
    longEntryConditions: 'Please configure at least one long entry condition.',
    shortEntryConditions: 'Please configure at least one short entry condition.',
  };

  return messages[field] || 'Please check this field and try again.';
};

export const getStrategySpecificErrors = (error: any): string => {
  const message = error?.message || error?.Message || '';
  
  if (message.includes('strategyName')) {
    return 'Strategy name is required and must be unique.';
  }
  if (message.includes('instruments')) {
    return 'Please select at least one trading instrument.';
  }
  if (message.includes('legs')) {
    return 'Please add at least one order leg for your strategy.';
  }
  if (message.includes('validation')) {
    return 'Please check all required fields and ensure they contain valid values.';
  }
  if (message.includes('duplicate') || message.includes('already exists')) {
    return 'A strategy with this name already exists. Please choose a different name.';
  }
  
  return getErrorMessage(error);
};
