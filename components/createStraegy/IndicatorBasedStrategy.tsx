import React from "react";
import { Info, Trash2, ArrowUpDown } from "lucide-react";
import { OrderLeg } from "../../types/strategyTypes";

interface Condition {
  indicator: string;
  comparator: string;
  value: string;
}

interface ConditionRowProps {
  condition: Condition;
  index: number;
  type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions';
  label: string;
  color: string;
  onRemove: (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number) => void;
  onUpdate: (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number, field: string, value: string) => void;
}

interface IndicatorBasedStrategyProps {
  formData: {
    longEntryConditions: Condition[];
    shortEntryConditions: Condition[];
    exitConditions: Condition[];
    useCombinedChart: boolean;
    chartType?: string;
    interval?: string;
    transactionType?: string;
    legs?: OrderLeg[];
  };
  onInputChange: (field: string, value: any) => void;
  onAddCondition: (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions') => void;
  onRemoveCondition: (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number) => void;
  onUpdateCondition: (type: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number, field: string, value: string) => void;
  onAddLeg: () => void;
  onRemoveLeg: (index: number) => void;
  onUpdateLeg: <K extends keyof OrderLeg>(index: number, field: K, value: OrderLeg[K]) => void;
  onUpdateNestedLeg: (index: number, parentField: "stopLoss" | "target", childField: keyof OrderLeg["stopLoss"], value: any) => void;
}

// Condition Row Component
const ConditionRow: React.FC<ConditionRowProps> = ({ condition, index, type, label, color, onRemove, onUpdate }) => {
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
          placeholder="Enter value (e.g., 50, 0.5, 2000)"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};


// Indicator Based Strategy Component
const IndicatorBasedStrategy: React.FC<IndicatorBasedStrategyProps> = ({ 
  formData, 
  onInputChange, 
  onAddCondition, 
  onRemoveCondition, 
  onUpdateCondition,
  onAddLeg,
  onRemoveLeg,
  onUpdateLeg,
  onUpdateNestedLeg
}) => {
  return (
    <div className="space-y-6">
      {/* Entry Conditions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Entry Conditions</h3>
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
        
        <p className="text-sm text-gray-600 mb-6">
          Configure entry conditions for your strategy. You can set multiple conditions for both long and short positions.
        </p>

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
          <span className="text-sm font-medium">Exit Conditions (Optional)</span>
        </label>
        
        {formData.exitConditions.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Configure exit conditions to automatically close positions when certain criteria are met.
          </p>
        )}

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

      {/* Chart Configuration */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Chart Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={formData.chartType || "Candle"}
              onChange={(e) => onInputChange('chartType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Candle">Candlestick</option>
              <option value="Line">Line</option>
              <option value="Bar">Bar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interval</label>
            <select
              value={formData.interval || "5 Min"}
              onChange={(e) => onInputChange('interval', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1 Min">1 Minute</option>
              <option value="5 Min">5 Minutes</option>
              <option value="15 Min">15 Minutes</option>
              <option value="30 Min">30 Minutes</option>
              <option value="1 Hour">1 Hour</option>
              <option value="1 Day">1 Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select
              value={formData.transactionType || "Both Side"}
              onChange={(e) => onInputChange('transactionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Both Side">Both Side</option>
              <option value="Long Only">Long Only</option>
              <option value="Short Only">Short Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Option Position Builder */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Option Position Builder</h3>
          <button
            type="button"
            onClick={onAddLeg}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Add leg +
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Configure option positions for your strategy</p>
        
        {formData.legs && formData.legs.length > 0 && (
          <div className="space-y-4">
            {formData.legs.map((leg, index) => (
              <OrderLegComponent
                key={index}
                leg={leg}
                index={index}
                onRemove={onRemoveLeg}
                onUpdate={onUpdateLeg}
                onNestedUpdate={onUpdateNestedLeg}
              />
            ))}
          </div>
        )}
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

// Order Leg Component for Indicator Based Strategy
const OrderLegComponent: React.FC<{
  leg: OrderLeg;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: <K extends keyof OrderLeg>(index: number, field: K, value: OrderLeg[K]) => void;
  onNestedUpdate: (
    index: number,
    parentField: "stopLoss" | "target",
    childField: keyof OrderLeg["stopLoss"],
    value: any
  ) => void;
}> = ({ leg, index, onRemove, onUpdate, onNestedUpdate }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">
          Option Leg #{index + 1}
        </h4>
        <button
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 p-1"
          aria-label="Remove option leg"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-start mb-4 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              leg.orderType === "SELL"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
            onClick={() =>
              onUpdate(
                index,
                "orderType",
                leg.orderType === "SELL" ? "BUY" : "SELL"
              )
            }
            aria-label={`Toggle order type to ${leg.orderType === "SELL" ? "BUY" : "SELL"}`}
          >
            <span className="flex items-center">
              {leg.orderType}
              <ArrowUpDown size={12} className="inline ml-1" />
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty</span>
            <input
              type="number"
              value={leg.quantity}
              onChange={(e) => onUpdate(index, "quantity", parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              min="1"
              aria-label="Quantity"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              leg.optionType === "PE"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
            onClick={() =>
              onUpdate(index, "optionType", leg.optionType === "PE" ? "CE" : "PE")
            }
            aria-label={`Toggle option type to ${leg.optionType === "PE" ? "CE" : "PE"}`}
          >
            {leg.optionType}
            <ArrowUpDown size={12} className="inline ml-1" />
          </button>
        </div>

        <div className="flex items-center">
          <button
            className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-600"
            onClick={() =>
              onUpdate(
                index,
                "expiryType",
                leg.expiryType === "Weekly" ? "Monthly" : "Weekly"
              )
            }
            aria-label={`Toggle expiry type to ${leg.expiryType === "Weekly" ? "Monthly" : "Weekly"}`}
          >
            {leg.expiryType}
            <ArrowUpDown size={12} className="inline ml-1" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 col-span-2 lg:col-span-1">
          <select
            value={leg.strikeType}
            onChange={(e) => onUpdate(index, "strikeType", e.target.value as OrderLeg["strikeType"])}
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
            aria-label="Strike type"
          >
            <option value="ATM">ATM</option>
            <option value="ATMPER">ATMPER</option>
            <option value="ITM">ITM</option>
            <option value="OTM">OTM</option>
            <option value="CP">CP</option>
            <option value="CP >=">CP &gt;=</option>
            <option value="CP <=">CP &lt;=</option>
          </select>
          <input
            type="text"
            value={leg.strikeValue}
            onChange={(e) => onUpdate(index, "strikeValue", e.target.value)}
            className="w-full sm:w-24 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="e.g., ITM 2000"
            aria-label="Strike value"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border p-3 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Stop Loss</h5>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <select
              value={leg.stopLoss.type}
              onChange={(e) => onNestedUpdate(index, "stopLoss", "type", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
              aria-label="Stop loss type"
            >
              <option value="points">Points</option>
              <option value="percent">Percent</option>
            </select>
            <input
              type="number"
              value={leg.stopLoss.value}
              onChange={(e) => onNestedUpdate(index, "stopLoss", "value", parseFloat(e.target.value) || 0)}
              className="w-full sm:w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              step="0.01"
              aria-label="Stop loss value"
            />
            <select
              value={leg.stopLoss.trigger}
              onChange={(e) => onNestedUpdate(index, "stopLoss", "trigger", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              aria-label="Stop loss trigger"
            >
              <option value="price">Price</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="border p-3 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Target</h5>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <select
              value={leg.target.type}
              onChange={(e) => onNestedUpdate(index, "target", "type", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-gray-50"
              aria-label="Target type"
            >
              <option value="points">Points</option>
              <option value="percent">Percent</option>
            </select>
            <input
              type="number"
              value={leg.target.value}
              onChange={(e) => onNestedUpdate(index, "target", "value", parseFloat(e.target.value) || 0)}
              className="w-full sm:w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              step="0.01"
              aria-label="Target value"
            />
            <select
              value={leg.target.trigger}
              onChange={(e) => onNestedUpdate(index, "target", "trigger", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              aria-label="Target trigger"
            >
              <option value="price">Price</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorBasedStrategy;