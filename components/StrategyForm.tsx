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
import axios from "axios";
import Cookies from "js-cookie";
import { getStrategySpecificErrors } from "../utils/errorMessages";
import TemplateSelector from "./TemplateSelector";
import { StrategyTemplate } from "../hooks/useStrategyTemplates";
import { useValidation } from "../utils/validation";
import ValidatedInput from "./ValidatedInput";
import ValidationFeedback from "./ValidationFeedback";

const InstrumentsSection: React.FC<InstrumentsSectionProps> = ({
  selectedInstruments,
  onAddInstruments,
  onRemoveInstrument,
}) => (
  <div>
    <h3 className="font-medium mb-4">Select Instrument</h3>
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
        <span className="text-sm font-medium">Add Instrument</span>
      </button>
    )}
  </div>
);

const StrategyNameAndSave: React.FC<StrategyNameAndSaveProps & {
  isEditMode?: boolean;
  getFieldErrors: (field: string) => string[];
  getFieldWarnings: (field: string) => string[];
  isFieldValid: (field: string) => boolean;
  isFormValid: boolean;
  getFormErrors: () => string[];
  getFormWarnings: () => string[];
}> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  isEditMode = false,
  getFieldErrors,
  getFieldWarnings,
  isFieldValid,
  isFormValid,
  getFormErrors,
  getFormWarnings
}) => (
  <div className="border border-gray-200 rounded-lg p-6">
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ValidatedInput
            type="text"
            placeholder="Enter strategy name"
            value={formData.strategyName}
            onChange={(e) => onInputChange("strategyName", e.target.value)}
            label="Strategy Name"
            required
            errors={getFieldErrors("strategyName")}
            warnings={getFieldWarnings("strategyName")}
            isValid={isFieldValid("strategyName")}
            helpText="Choose a descriptive name for your strategy"
          />
        </div>
        <button type="button" className="text-gray-400 hover:text-gray-600">
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {/* Form-level validation feedback */}
      {(getFormErrors().length > 0 || getFormWarnings().length > 0) && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <ValidationFeedback
            errors={getFormErrors()}
            warnings={getFormWarnings()}
            isValid={isFormValid}
          />
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !isFormValid}
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ${
            isSubmitting || !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Strategy' : 'Save & Continue')}
        </button>
      </div>
    </div>
  </div>
);

interface StrategyCreatorProps {
  strategyId?: string;
  isEditMode?: boolean;
}

const StrategyCreator: React.FC<StrategyCreatorProps> = ({ strategyId, isEditMode = false }) => {
  const [strategyType, setStrategyType] = useState<"Time Based" | "Indicator Based">("Time Based");
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [orderLegs, setOrderLegs] = useState<OrderLeg[]>([]);
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const router = useRouter();
  const { saveStrategyData, updateStrategyData, isLoading, error, resetError } = useStrategyApi();

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

  // Real-time validation
  const {
    validationResults,
    formValidation,
    isFieldValid,
    getFieldErrors,
    getFieldWarnings,
    isFormValid,
    getFormErrors,
    getFormWarnings
  } = useValidation(formData, strategyType, selectedInstruments, orderLegs);

  // Load existing strategy data when in edit mode
  useEffect(() => {
    if (isEditMode && strategyId) {
      loadStrategyData();
    }
  }, [isEditMode, strategyId]);

  const loadStrategyData = async () => {
    setIsLoadingStrategy(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://103.189.173.82:4000/api'}/user/strategies/${strategyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const strategy = response.data.data;
      
      // Populate form with existing strategy data
      setFormData({
        strategyName: strategy.strategyName || "",
        orderType: strategy.orderType || "MIS",
        startTime: strategy.startTime || "09:16",
        squareOff: strategy.squareOffTime || "03:15",
        noTradeAfter: strategy.noTradeAfter || "03:15",
        selectedDays: strategy.tradeDays || ["MON", "TUE", "WED", "THU", "FRI"],
        maxProfit: strategy.riskManagement?.exitWhenProfit || 5000,
        maxLoss: strategy.riskManagement?.exitWhenLoss || 3000,
        profitTrailing: strategy.profitTrailing || "No Trailing",
        trailingConfig: strategy.trailingConfig || {},
        transactionType: strategy.transactionType || "Both Side",
        chartType: strategy.chartType || "Candle",
        interval: strategy.interval || "5 Min",
        longEntryConditions: strategy.longEntryConditions || [{ indicator: "", comparator: "", value: "" }],
        shortEntryConditions: strategy.shortEntryConditions || [{ indicator: "", comparator: "", value: "" }],
        exitConditions: strategy.exitConditions || [],
        useCombinedChart: strategy.useCombinedChart || false,
        maxTradeCycle: strategy.maxTradeCycle || "1",
        legs: strategy.legs || [],
      });

      setStrategyType(strategy.strategyType || "Time Based");
      setSelectedInstruments(strategy.instruments || []);
      setOrderLegs(strategy.legs || []);
    } catch (err) {
      console.error('Error loading strategy:', err);
      alert('Failed to load strategy data');
    } finally {
      setIsLoadingStrategy(false);
    }
  };

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

  const handleSelectTemplate = (template: StrategyTemplate) => {
    // Populate form with template data
    setFormData({
      strategyName: `${template.templateName} - Copy`,
      orderType: template.orderType,
      startTime: template.startTime,
      squareOff: template.squareOffTime,
      noTradeAfter: template.noTradeAfter,
      selectedDays: template.tradeDays,
      maxProfit: template.riskManagement.exitWhenProfit,
      maxLoss: template.riskManagement.exitWhenLoss,
      profitTrailing: template.profitTrailing,
      trailingConfig: template.trailingConfig,
      transactionType: template.transactionType || "Both Side",
      chartType: template.chartType || "Candle",
      interval: template.interval || "5 Min",
      longEntryConditions: template.longEntryConditions || [{ indicator: "", comparator: "", value: "" }],
      shortEntryConditions: template.shortEntryConditions || [{ indicator: "", comparator: "", value: "" }],
      exitConditions: template.exitConditions || [],
      useCombinedChart: template.useCombinedChart || false,
      maxTradeCycle: template.maxTradeCycle || "1",
      legs: template.legs || [],
    });

    setStrategyType(template.strategyType);
    setSelectedInstruments(template.instruments);
    setOrderLegs(template.legs || []);
  };

const handleSubmit = async () => {
  // Enhanced validation with better error messages
  if (!formData.strategyName.trim()) {
    alert("Please enter a strategy name to continue.");
    return;
  }

  if (selectedInstruments.length === 0) {
    alert("Please select a trading instrument for your strategy.");
    return;
  }

  if (strategyType === "Time Based" && orderLegs.length === 0) {
    alert("Please add at least one order leg for your time-based strategy.");
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
      alert("Please configure at least one entry condition (Long or Short) for your indicator-based strategy.");
      return;
    }

    // Validate that at least one option leg is configured
    if (!formData.legs || formData.legs.length === 0) {
      alert("Please add at least one option leg for your indicator-based strategy.");
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
    if (isEditMode && strategyId) {
      await updateStrategyData(strategyId, payload);
      alert('Strategy updated successfully! You can now view it in your strategies list.');
    } else {
      await saveStrategyData(payload);
      alert('Strategy created successfully! You can now view it in your strategies list.');
    }
    
    // Reset form after successful save/update
    router.push('/dashboard/strategies');
    if (!isEditMode) {
      setFormData({
        ...formData,
        strategyName: "",
      });
      setSelectedInstruments([]);
      setOrderLegs([]);
    }
  } catch (error) {
    // Enhanced error handling
    const errorMessage = getStrategySpecificErrors(error);
    console.error(`Strategy ${isEditMode ? 'update' : 'creation'} failed:`, error);
    alert(`Failed to ${isEditMode ? 'update' : 'save'} strategy: ${errorMessage}`);
  }
};

  if (isLoadingStrategy) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading strategy data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-8">
          {/* Template Selection Button */}
          {!isEditMode && (
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create New Strategy</h2>
              {/* <button
                type="button"
                onClick={() => setIsTemplateSelectorOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Use Template
              </button> */}
            </div>
          )}
          
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
            isEditMode={isEditMode}
            getFieldErrors={getFieldErrors}
            getFieldWarnings={getFieldWarnings}
            isFieldValid={isFieldValid}
            isFormValid={isFormValid}
            getFormErrors={getFormErrors}
            getFormWarnings={getFormWarnings}
          />
        </div>
      </div>

      <InstrumentModal
        isOpen={isInstrumentModalOpen}
        onClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstruments={handleSelectInstruments}
        initiallySelected={selectedInstruments}
      />

      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        strategyType={strategyType}
      />
    </>
  );
};

export default StrategyCreator;
export { StrategyCreator as StrategyForm };