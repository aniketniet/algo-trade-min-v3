import React, { useEffect, useState } from "react";
import { X, Trash2, ArrowUpDown } from "lucide-react";

interface StopLossTarget {
  type: "points" | "percentage";
  value: number;
  trigger: "price" | "premium";
}

interface OrderLeg {
  orderType: "BUY" | "SELL";
  optionType: "CE" | "PE";
  expiryType: "Weekly" | "Monthly";
  quantity: number;
  strikeType: "ATM" | "ITM" | "OTM";
  strikeValue: string;
  stopLoss: StopLossTarget;
  target: StopLossTarget;
}

interface TimeBasedStrategyProps {
  selectedInstruments?: string[];
  onStrategyDataChange?: (orderLegs: OrderLeg[]) => void;
}

const TimeBasedStrategy: React.FC<TimeBasedStrategyProps> = ({
  selectedInstruments = [],
  onStrategyDataChange,
}) => {
  const [orderLegs, setOrderLegs] = useState<OrderLeg[]>([]);

  const addOrderLeg = () => {
    if (selectedInstruments.length === 0) {
      alert("Please select instruments first");
      return;
    }

    const newLeg: OrderLeg = {
      orderType: "SELL",
      optionType: "PE",
      expiryType: "Weekly",
      quantity: 75,
      strikeType: "ATM",
      strikeValue: "ITM 2000",
      stopLoss: {
        type: "points",
        value: 30,
        trigger: "price"
      },
      target: {
        type: "points",
        value: 50,
        trigger: "price"
      }
    };

    setOrderLegs([...orderLegs, newLeg]);
  };

  const removeOrderLeg = (index: number) => {
    setOrderLegs(orderLegs.filter((_, i) => i !== index));
  };

  const updateOrderLeg = <K extends keyof OrderLeg>(
    index: number,
    field: K,
    value: OrderLeg[K]
  ) => {
    setOrderLegs(
      orderLegs.map((leg, i) => 
        i === index ? { ...leg, [field]: value } : leg
      )
    );
  };

  const updateNestedOrderLeg = (
    index: number,
    parentField: "stopLoss" | "target",
    childField: keyof StopLossTarget,
    value: any
  ) => {
    setOrderLegs(
      orderLegs.map((leg, i) => 
        i === index ? { 
          ...leg, 
          [parentField]: {
            ...leg[parentField],
            [childField]: value
          }
        } : leg
      )
    );
  };

  useEffect(() => {
    if (onStrategyDataChange) {
      onStrategyDataChange(orderLegs);
    }
  }, [orderLegs, onStrategyDataChange]);

  const OrderLegComponent: React.FC<{
    leg: OrderLeg;
    index: number;
    onRemove: (index: number) => void;
    onUpdate: <K extends keyof OrderLeg>(index: number, field: K, value: OrderLeg[K]) => void;
    onNestedUpdate: (
      index: number,
      parentField: "stopLoss" | "target",
      childField: keyof StopLossTarget,
      value: any
    ) => void;
  }> = ({ leg, index, onRemove, onUpdate, onNestedUpdate }) => (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">
          Order Leg #{index + 1}
        </h4>
        <button
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 p-1"
          aria-label="Remove order leg"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-start mb-4  gap-4">
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
            <span className="flex items-center ">
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
            <option value="ITM">ITM</option>
            <option value="OTM">OTM</option>
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
              <option value="percentage">Percentage</option>
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
              <option value="percentage">Percentage</option>
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Order Legs</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-gray-600">
              Selected Instruments: {selectedInstruments.length}
            </span>
            <button
              onClick={addOrderLeg}
              disabled={selectedInstruments.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedInstruments.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              aria-label="Add order leg"
            >
              ADD LEG +
            </button>
          </div>
        </div>
      </div>

      {orderLegs.length > 0 && (
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h4 className="text-md sm:text-lg font-semibold text-gray-800">
              Active Order Legs ({orderLegs.length})
            </h4>
            <button
              onClick={() => setOrderLegs([])}
              className="text-red-600 hover:text-red-800 text-sm font-medium self-start sm:self-auto"
              aria-label="Clear all order legs"
            >
              Clear All
            </button>
          </div>

          {orderLegs.map((leg, index) => (
            <OrderLegComponent
              key={index}
              leg={leg}
              index={index}
              onRemove={removeOrderLeg}
              onUpdate={updateOrderLeg}
              onNestedUpdate={updateNestedOrderLeg}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeBasedStrategy;