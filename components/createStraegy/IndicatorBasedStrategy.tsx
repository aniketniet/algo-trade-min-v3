import { Info, Trash2 } from "lucide-react";

// Condition Row Component
const ConditionRow = ({ condition, index, type, label, color, onRemove, onUpdate }) => {
  const indicators = ["SMA", "EMA", "RSI", "MACD", "Bollinger Bands", "Stochastic"];
  const comparators = [">", "<", ">=", "<=", "=", "Cross Above", "Cross Below"];

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${color}`}>{label}</span>
        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(type, index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <select
          value={condition.indicator}
          onChange={(e) => onUpdate(type, index, 'indicator', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Indicator</option>
          {indicators.map(indicator => (
            <option key={indicator} value={indicator}>{indicator}</option>
          ))}
        </select>
        <select
          value={condition.comparator}
          onChange={(e) => onUpdate(type, index, 'comparator', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Comparator</option>
          {comparators.map(comp => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>
        <input
          type="text"
          value={condition.value}
          onChange={(e) => onUpdate(type, index, 'value', e.target.value)}
          placeholder="Select Indicator"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};


// Indicator Based Strategy Component
const IndicatorBasedStrategy = ({ formData, onInputChange, onAddCondition, onRemoveCondition, onUpdateCondition }) => {
  return (
    <div className="space-y-6">
      {/* Entry Conditions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Entry conditions</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.useCombinedChart}
              onChange={(e) => onInputChange('useCombinedChart', e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-600">Use Combined Chart</span>
            <Info className="w-4 h-4 text-gray-400" />
          </label>
        </div>

        {/* Long Entry Conditions */}
        <div className="mb-6">
          {formData.longEntryConditions.map((condition, index) => 
            <ConditionRow
              key={index}
              condition={condition}
              index={index}
              type="longEntryConditions"
              label="Long Entry condition"
              color="text-green-600"
              onRemove={onRemoveCondition}
              onUpdate={onUpdateCondition}
            />
          )}
        </div>

        {/* Short Entry Conditions */}
        <div className="mb-6">
          {formData.shortEntryConditions.map((condition, index) => 
            <ConditionRow
              key={index}
              condition={condition}
              index={index}
              type="shortEntryConditions"
              label="Short Entry condition"
              color="text-red-600"
              onRemove={onRemoveCondition}
              onUpdate={onUpdateCondition}
            />
          )}
        </div>
        <div className="flex justify-center">

        <button
          type="button"
          onClick={() => {
            onAddCondition('longEntryConditions');
            onAddCondition('shortEntryConditions');
          }}
          className="text-blue-600 text-sm hover:text-blue-700 border border-blue-600 hover:border-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          + Add Condition 
        </button>
          </div>
      </div>

      {/* Exit Conditions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.exitConditions.length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                onInputChange('exitConditions', [{ indicator: "", comparator: "", value: "" }]);
              } else {
                onInputChange('exitConditions', []);
              }
            }}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium">Exit conditions (Optional)</span>
        </label>

        {formData.exitConditions.map((condition, index) => (
          <ConditionRow
            key={index}
            condition={condition}
            index={index}
            type="exitConditions"
            label="Exit condition"
            color="text-orange-600"
            onRemove={onRemoveCondition}
            onUpdate={onUpdateCondition}
          />
        ))}
      </div>

      {/* Option Position Builder */}
      <div className=" flex justify-between border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Option Position builder</h3>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Add leg +
        </button>
      </div>

      {/* Signal Candle Condition */}
      <div className="border border-gray-200 rounded-lg p-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Add Signal Candle Condition (Optional)</span>
          <Info className="w-4 h-4 text-gray-400" />
        </label>
      </div>
    </div>
  );
};

export default IndicatorBasedStrategy;