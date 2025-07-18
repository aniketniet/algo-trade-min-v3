import React, { useState, useEffect } from 'react';

const ProfitTrailing = ({ formData, onInputChange }) => {
  const profitTrailingOptions = [
    'No Trailing',
    'Lock Fix Profit', 
    'Trail Profit',
    'Lock and Trail'
  ];

  // Determine initial selected option based on trailingConfig
  const getInitialOption = () => {
    const config = formData.trailingConfig || {};
    
    if (config.lockProfitAt > 0 && config.trailProfitBy > 0) return 'Lock and Trail';
    if (config.lockProfitAt > 0) return 'Lock Fix Profit';
    if (config.trailProfitBy > 0) return 'Trail Profit';
    return 'No Trailing';
  };

  const [selectedOption, setSelectedOption] = useState(getInitialOption());
  const [inputValues, setInputValues] = useState({
    profitReaches: formData.trailingConfig?.profitReaches || '',
    lockProfitAt: formData.trailingConfig?.lockProfitAt || '',
    everyIncreaseBy: formData.trailingConfig?.everyIncrease || '',
    trailProfitBy: formData.trailingConfig?.trailProfitBy || '',
    onEveryIncreaseOf: formData.trailingConfig?.onEveryIncreaseOf || ''
  });

  // Update formData when inputs change
  useEffect(() => {
    let trailingConfig = {};
    
    switch(selectedOption) {
      case 'Lock Fix Profit':
        trailingConfig = {
          profitReaches: inputValues.profitReaches,
          lockProfitAt: inputValues.lockProfitAt
        };
        break;
      case 'Trail Profit':
        trailingConfig = {
          onEveryIncreaseOf: inputValues.onEveryIncreaseOf,
          trailProfitBy: inputValues.trailProfitBy
        };
        break;
      case 'Lock and Trail':
        trailingConfig = {
          profitReaches: inputValues.profitReaches,
          lockProfitAt: inputValues.lockProfitAt,
          everyIncrease: inputValues.everyIncreaseBy,
          trailProfitBy: inputValues.trailProfitBy
        };
        break;
      default:
        trailingConfig = {
          lockProfitAt: 0,
          trailProfitBy: 0,
          everyIncrease: 0
        };
    }

    onInputChange('trailingConfig', trailingConfig);
    onInputChange('profitTrailing', selectedOption);
  }, [selectedOption, inputValues]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    // Reset input values when option changes
    setInputValues({
      profitReaches: '',
      lockProfitAt: '',
      everyIncreaseBy: '',
      trailProfitBy: '',
      onEveryIncreaseOf: ''
    });
  };

  const handleInputChange = (field, value) => {
    // Ensure only numbers are entered
    const numericValue = value === '' ? '' : Number(value.replace(/[^0-9.]/g, ''));
    setInputValues(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const renderInputFields = () => {
    switch (selectedOption) {
      case 'Lock Fix Profit':
        return (
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="If Profit Reaches"
                value={inputValues.profitReaches}
                onChange={(e) => handleInputChange('profitReaches', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Lock Profit at"
                value={inputValues.lockProfitAt}
                onChange={(e) => handleInputChange('lockProfitAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'Trail Profit':
        return (
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="On Every increase of"
                value={inputValues.onEveryIncreaseOf}
                onChange={(e) => handleInputChange('onEveryIncreaseOf', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Trail Profit By"
                value={inputValues.trailProfitBy}
                onChange={(e) => handleInputChange('trailProfitBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'Lock and Trail':
        return (
          <div className="space-y-4 mt-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="If Profit Reaches"
                  value={inputValues.profitReaches}
                  onChange={(e) => handleInputChange('profitReaches', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Lock Profit at"
                  value={inputValues.lockProfitAt}
                  onChange={(e) => handleInputChange('lockProfitAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Every Increase In Profit By"
                  value={inputValues.everyIncreaseBy}
                  onChange={(e) => handleInputChange('everyIncreaseBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Trail Profit By"
                  value={inputValues.trailProfitBy}
                  onChange={(e) => handleInputChange('trailProfitBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-6 bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profit Trailing</h2>
      
      <div className="flex gap-6 mb-4">
        {profitTrailingOptions.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="profitTrailing"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">{option}</span>
          </label>
        ))}
      </div>

      {renderInputFields()}
    </div>
  );
};

export default ProfitTrailing;