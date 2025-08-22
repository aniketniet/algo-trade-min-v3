// components/StrategyCreator.tsx
import React, { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Info, X, Search } from "lucide-react";
import InstrumentModal from "./createStraegy/InstrumentModel";
import StrategyTypeSelector from "./createStraegy/StrategyType";
import BasicConfiguration from "./createStraegy/BasicConfiguration";
import TimeBasedStrategy from "./createStraegy/TimeBasedStrategy";
import RiskManagement from "./createStraegy/RiskManagement";
import IndicatorBasedStrategy from "./createStraegy/IndicatorBasedStrategy";
import ProfitTrailing from "./createStraegy/ProfitTrailing";


import { FormData, OrderLeg, InstrumentsSectionProps, StrategyNameAndSaveProps, Day } from "../types/strategyTypes";
import { useStrategyApi } from "@/hooks/useStrategyApi";
import { useRouter } from "next/navigation";

const InstrumentsSection: React.FC<InstrumentsSectionProps> = ({
  selectedInstruments,
  onAddInstruments,
  onRemoveInstrument,
}) => (
  <div>
    <h3 className="font-medium mb-4">Select Instruments</h3>
    {selectedInstruments.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {selectedInstruments.map((instrument) => (
          <div
            key={instrument}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {instrument}
            <button
              onClick={() => onRemoveInstrument(instrument)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <button
        type="button"
        onClick={onAddInstruments}
        className="w-48 h-24 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-6 h-6 mb-1" />
        <span className="text-sm font-medium">Add Instruments</span>
      </button>
    )}
  </div>
);

const StrategyNameAndSave: React.FC<StrategyNameAndSaveProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
}) => (
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
        disabled={isSubmitting}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
  </div>
);

const StrategyCreator: React.FC = () => {
  const [strategyType, setStrategyType] = useState<"Time Based" | "Indicator Based">("Time Based");
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [orderLegs, setOrderLegs] = useState<OrderLeg[]>([]);
   const router = useRouter();
  const { saveStrategyData, isLoading, error, resetError } = useStrategyApi();


  
  // useEffect(() => {
  //   // Check authentication on component mount
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/login');
  //   }
  // }, [router]);

  const [formData, setFormData] = useState<FormData>({
    strategyName: "",
    orderType: "MIS",
    startTime: "09:16",
    squareOff: "03:15",
    noTradeAfter: "03:15",
    selectedDays: ["MON", "TUE", "WED", "THU", "FRI"],
    maxProfit: 5000,
    maxLoss: 3000,
    profitTrailing: "No Trailing",
    trailingConfig: {},
    transactionType: "Both Side",
    chartType: "Candle",
    interval: "5 Min",
    longEntryConditions: [{ indicator: "", comparator: "", value: "" }],
    shortEntryConditions: [{ indicator: "", comparator: "", value: "" }],
    exitConditions: [],
    useCombinedChart: false,
    maxTradeCycle: "1",
    legs: [],
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: Day) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleRemoveInstrument = (instrumentToRemove: string) => {
    setSelectedInstruments((prev) =>
      prev.filter((instrument) => instrument !== instrumentToRemove)
    );
  };

  const handleSelectInstruments = (instruments: string[]) => {
    setSelectedInstruments(instruments);
  };

  const handleTimeBasedStrategyData = (legs: OrderLeg[]) => {
    setOrderLegs(legs);
  };

  // Handler functions for Indicator Based Strategy
  const handleAddCondition = (conditionType: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions') => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: [...prev[conditionType], { indicator: "", comparator: "", value: "" }]
    }));
  };

  const handleRemoveCondition = (conditionType: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: prev[conditionType].filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCondition = (conditionType: 'longEntryConditions' | 'shortEntryConditions' | 'exitConditions', index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: prev[conditionType].map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  // Handler functions for Option Legs in Indicator Based Strategy
  const handleAddLeg = () => {
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

    setFormData(prev => ({
      ...prev,
      legs: [...(prev.legs || []), newLeg]
    }));
  };

  const handleRemoveLeg = (index: number) => {
    setFormData(prev => ({
      ...prev,
      legs: (prev.legs || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateLeg = <K extends keyof OrderLeg>(
    index: number,
    field: K,
    value: OrderLeg[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      legs: (prev.legs || []).map((leg, i) => 
        i === index ? { ...leg, [field]: value } : leg
      )
    }));
  };

  const handleUpdateNestedLeg = (
    index: number,
    parentField: "stopLoss" | "target",
    childField: keyof OrderLeg["stopLoss"],
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      legs: (prev.legs || []).map((leg, i) => 
        i === index ? { 
          ...leg, 
          [parentField]: {
            ...leg[parentField],
            [childField]: value
          }
        } : leg
      )
    }));
  };

const handleSubmit = async () => {
  if (!formData.strategyName) {
    alert("Please enter a strategy name");
    return;
  }

  if (selectedInstruments.length === 0) {
    alert("Please select at least one instrument");
    return;
  }

  if (strategyType === "Time Based" && orderLegs.length === 0) {
    alert("Please add at least one order leg");
    return;
  }

  if (strategyType === "Indicator Based") {
    // Validate that at least one entry condition is configured
    const hasLongConditions = formData.longEntryConditions.some(condition => 
      condition.indicator && condition.comparator && condition.value
    );
    const hasShortConditions = formData.shortEntryConditions.some(condition => 
      condition.indicator && condition.comparator && condition.value
    );
    
    if (!hasLongConditions && !hasShortConditions) {
      alert("Please configure at least one entry condition (Long or Short)");
      return;
    }

    // Validate that at least one option leg is configured
    if (!formData.legs || formData.legs.length === 0) {
      alert("Please add at least one option leg for the Indicator Based strategy");
      return;
    }
  }

  // Transform the payload to match the backend schema exactly
  const payload: any = {
    strategyName: formData.strategyName,
    strategyType: strategyType,
    instruments: selectedInstruments,
    orderType: formData.orderType,
    startTime: formData.startTime,
    squareOffTime: formData.squareOff,
    noTradeAfter: formData.noTradeAfter,
    tradeDays: formData.selectedDays,
    riskManagement: {
      exitWhenProfit: Number(formData.maxProfit),
      exitWhenLoss: Number(formData.maxLoss),
    },
    profitTrailing: formData.profitTrailing,
    trailingConfig: {
      lockProfitAt: formData.trailingConfig?.lockProfitAt || 0,
      trailProfitBy: formData.trailingConfig?.trailProfitBy || 0,
      everyIncrease: formData.trailingConfig?.everyIncrease || 0,
    },
    legs: orderLegs.map(leg => ({
      orderType: leg.orderType,
      optionType: leg.optionType,
      expiryType: leg.expiryType,
      quantity: leg.quantity,
      strikeType: leg.strikeType,
      strikeValue: leg.strikeValue,
      stopLoss: {
        type: leg.stopLoss?.type || "points",
        value: leg.stopLoss?.value || 0,
        trigger: leg.stopLoss?.trigger || "price"
      },
      target: {
        type: leg.target?.type || "points",
        value: leg.target?.value || 0,
        trigger: leg.target?.trigger || "price"
      }
    })),
    // Add mode field for backend
    mode: "backtest"
  };

  // Add indicator-based fields if needed
  if (strategyType === "Indicator Based") {
    payload.longEntryConditions = formData.longEntryConditions;
    payload.shortEntryConditions = formData.shortEntryConditions;
    payload.exitConditions = formData.exitConditions;
    payload.useCombinedChart = formData.useCombinedChart;
    payload.transactionType = formData.transactionType;
    payload.chartType = formData.chartType;
    payload.interval = formData.interval;
    payload.maxTradeCycle = formData.maxTradeCycle;
    payload.legs = formData.legs || [];
  }

  try {
    await saveStrategyData(payload);
    alert('Strategy saved successfully!');
    // Reset form after successful save
    router.push('/dashboard/strategies');
    setFormData({
      ...formData,
      strategyName: "",
    });
    setSelectedInstruments([]);
    setOrderLegs([]);
  } catch (error) {
    // Error is already handled by the hook
    console.error('Strategy creation failed:', error);
  }
};

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-8">
          <StrategyTypeSelector
            strategyType={strategyType}
            onStrategyTypeChange={setStrategyType}
          />

          <InstrumentsSection
            selectedInstruments={selectedInstruments}
            onAddInstruments={() => setIsInstrumentModalOpen(true)}
            onRemoveInstrument={handleRemoveInstrument}
          />

          <BasicConfiguration
            formData={formData}
            onInputChange={handleInputChange}
            onToggleDay={toggleDay}
          />

          {strategyType === "Time Based" && (
            <TimeBasedStrategy
              selectedInstruments={selectedInstruments}
              onStrategyDataChange={handleTimeBasedStrategyData}
            />
          )}

          {strategyType === "Indicator Based" && (
            <IndicatorBasedStrategy
              formData={formData}
              onInputChange={handleInputChange}
              onAddCondition={handleAddCondition}
              onRemoveCondition={handleRemoveCondition}
              onUpdateCondition={handleUpdateCondition}
              onAddLeg={handleAddLeg}
              onRemoveLeg={handleRemoveLeg}
              onUpdateLeg={handleUpdateLeg}
              onUpdateNestedLeg={handleUpdateNestedLeg}
            />
          )}

          <RiskManagement
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ProfitTrailing
            formData={formData}
            onInputChange={handleInputChange}
          />

          <StrategyNameAndSave
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
          />
        </div>
      </div>

      <InstrumentModal
        isOpen={isInstrumentModalOpen}
        onClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstruments={handleSelectInstruments}
        initiallySelected={selectedInstruments}
      />
    </>
  );
};

export default StrategyCreator;