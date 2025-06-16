import React, { useState } from "react";
import { Clock } from "lucide-react";

const StrategyForm = ({ onSubmit }) => {
  const [strategyName, setStrategyName] = useState("");
  const [strategyType, setStrategyType] = useState("Long & Short");
  const [orderType, setOrderType] = useState("MIS");
  const [startTime, setStartTime] = useState("09:16");
  const [endTime, setEndTime] = useState("15:15");
  const [noTradeAfter, setNoTradeAfter] = useState("15:00");
  const [profitTrailing, setProfitTrailing] = useState("No Trailing");
  const [maxProfit, setMaxProfit] = useState(5000);
  const [maxLoss, setMaxLoss] = useState(2000);
  const [instruments, setInstruments] = useState(["NIFTY", "BANKNIFTY"]);
  const [selectedDays, setSelectedDays] = useState(["MON", "TUE", "WED", "THU", "FRI"]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const strategyData = {
      strategyName,
      strategyType,
      instruments,
      orderType,
      startTime,
      squareOffTime: endTime,
      noTradeAfter,
      orderLegs: [
        {
          legName: "Buy if EMA 20 > EMA 50",
          conditions: [{ indicator: "EMA", operator: ">", value: 50 }],
          action: "BUY",
        },
      ],
      riskManagement: {
        maxProfit,
        maxLoss,
      },
      profitTrailing,
      trailingConfig: {
        lockAmount: 1500,
        trailStep: 100,
      },
    };

    onSubmit(strategyData);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit}>
        {/* Strategy Type */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Strategy Type</h2>
          <div className="flex gap-4">
            {["Long & Short", "Long Only", "Short Only"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setStrategyType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  strategyType === type
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Order Configuration */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium mb-4">Order Type</h3>
            <div className="flex gap-4">
              {["MIS", "CNC", "BTST"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="orderType"
                    value={type}
                    checked={orderType === type}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Timing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Square off
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Days */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">Trading Days</h3>
          <div className="flex gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Management */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-6">Risk management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Max Profit (₹)
              </label>
              <input
                type="number"
                value={maxProfit}
                onChange={(e) => setMaxProfit(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Max Loss (₹)
              </label>
              <input
                type="number"
                value={maxLoss}
                onChange={(e) => setMaxLoss(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                No Trade After
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={noTradeAfter}
                  onChange={(e) => setNoTradeAfter(e.target.value)}
                  className="px-3 py-2 border border-blue-500 rounded-lg text-sm flex-1"
                />
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Profit Trailing */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Profit Trailing</h2>
          <div className="flex gap-6">
            {[
              "No Trailing",
              "Lock Fix Profit",
              "Trail Profit",
              "Lock and Trail",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="profitTrailing"
                  value={option}
                  checked={profitTrailing === option}
                  onChange={(e) => setProfitTrailing(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Strategy Name and Save */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <input
                type="text"
                placeholder="Strategy name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StrategyForm;