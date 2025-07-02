import React, { useState } from "react";
import { Clock, Plus, Trash2, Info, X, Search } from "lucide-react";
import InstrumentModal from "./createStraegy/InstrumentModel";
import StrategyTypeSelector from "./createStraegy/StrategyType";
import BasicConfiguration from "./createStraegy/BasicConfiguration";
import TimeBasedStrategy from "./createStraegy/TimeBasedStrategy";
import RiskManagement from "./createStraegy/RiskManagement";
import IndicatorBasedStrategy from "./createStraegy/IndicatorBasedStrategy";

// Instruments Section Component
const InstrumentsSection = ({ selectedInstruments, onAddInstruments }) => (
  <div>
    <h3 className="font-medium mb-4">Select Instruments</h3>
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedInstruments.map((instrument) => (
        <span
          key={instrument}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          {instrument}
        </span>
      ))}
    </div>
    <button
      type="button"
      onClick={onAddInstruments}
      className="w-48 h-24 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
    >
      <Plus className="w-6 h-6 mb-1" />
      <span className="text-sm font-medium">Add Instruments</span>
    </button>
  </div>
);

// Profit Trailing Component
const ProfitTrailing = ({ formData, onInputChange }) => {
  const profitTrailingOptions = [
    "No Trailing",
    "Lock Fix Profit",
    "Trail Profit",
    "Lock and Trail",
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Profit Trailing</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex gap-6">
        {profitTrailingOptions.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="profitTrailing"
              value={option}
              checked={formData.profitTrailing === option}
              onChange={(e) => onInputChange("profitTrailing", e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Strategy Name and Save Component
const StrategyNameAndSave = ({ formData, onInputChange, onSubmit }) => (
  <div className="border border-gray-200 rounded-lg p-6">
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Strategy name"
        value={formData.strategyName}
        onChange={(e) => onInputChange("strategyName", e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button type="button" className="text-gray-400 hover:text-gray-600">
        <Info className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Save & Continue
      </button>
    </div>
  </div>
);

// Main Strategy Creator Component
const StrategyCreator = () => {
  const [strategyType, setStrategyType] = useState("Time Based");
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [formData, setFormData] = useState({
    // Basic Configuration
    orderType: "MIS",
    startTime: "09:16",
    squareOff: "03:15",
    selectedDays: ["MON", "TUE", "WED", "THU", "FRI"],

    // Time Based Fields
    transactionType: "Both Side",
    chartType: "Candle",
    interval: "5 Min",

    // Indicator Based Fields
    longEntryConditions: [{ indicator: "", comparator: "", value: "" }],
    shortEntryConditions: [{ indicator: "", comparator: "", value: "" }],
    exitConditions: [],
    useCombinedChart: false,

    // Risk Management
    maxProfit: "",
    maxLoss: "",
    noTradeAfter: "03:15",
    maxTradeCycle: "1",

    // Profit Trailing
    profitTrailing: "No Trailing",

    // Strategy Name
    strategyName: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const addCondition = (type) => {
    const newCondition = { indicator: "", comparator: "", value: "" };
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], newCondition],
    }));
  };

  const removeCondition = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const updateCondition = (type, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      ),
    }));
  };

  const handleSubmit = () => {
    console.log("Strategy Data:", {
      strategyType,
      selectedInstruments,
      ...formData,
    });
    // Here you can add API call to save the strategy
  };

  const handleSelectInstruments = (instruments) => {
    setSelectedInstruments(instruments);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="space-y-8">
          {/* Strategy Type */}
          <StrategyTypeSelector
            strategyType={strategyType}
            onStrategyTypeChange={setStrategyType}
          />

          {/* Select Instruments */}
          <InstrumentsSection
            selectedInstruments={selectedInstruments}
            onAddInstruments={() => setIsInstrumentModalOpen(true)}
          />

          {/* Basic Configuration Row */}
          <BasicConfiguration
            formData={formData}
            onInputChange={handleInputChange}
            onToggleDay={toggleDay}
          />

          {/* Conditional Content Based on Strategy Type */}
          {strategyType === "Time Based" && (
            <TimeBasedStrategy
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          {strategyType === "Indicator Based" && (
            <IndicatorBasedStrategy
              formData={formData}
              onInputChange={handleInputChange}
              onAddCondition={addCondition}
              onRemoveCondition={removeCondition}
              onUpdateCondition={updateCondition}
            />
          )}

          {/* Risk Management */}
          <RiskManagement
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Profit Trailing */}
          <ProfitTrailing
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Strategy Name and Save */}
          <StrategyNameAndSave
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Instrument Selection Modal */}
      <InstrumentModal
        isOpen={isInstrumentModalOpen}
        onClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstruments={handleSelectInstruments}
      />
    </>
  );
};

export default StrategyCreator;
