"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Target, AlertCircle, CheckCircle, Save, Play, Copy, X } from "lucide-react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import InstrumentsSelectionModal from "./InstrumentsSelectionModal";

interface Instrument {
  _id: string;
  symbol: string;
  name: string;
  exchange: string;
  segment: string;
  instrument_type: string;
  lot_size: number;
  expiry?: string;
  strike_price?: number;
  tick_size: number;
  brokers: {
    angel: {
      token: string;
      tradable: boolean;
      last_updated: string;
    };
    dhan: {
      token: string;
      tradable: boolean;
      last_updated: string;
    };
  };
}

interface OrderLeg {
  action: 'BUY' | 'SELL';
  quantity: number;
  instrument_type: 'CE' | 'PE' | 'FUT' | 'EQ';
  expiry: 'Weekly' | 'Monthly';
  strike_price_reference: 'ATM pt' | 'ATM %' | 'CP' | 'CP >=' | 'CP <=';
  strike_price_selection: string;
  stop_loss_percentage: number;
  stop_loss_value: number;
  stop_loss_type: 'On Price' | 'On Percentage' | 'On Points';
  take_profit_percentage: number;
  take_profit_value: number;
  take_profit_type: 'On Price' | 'On Percentage' | 'On Points';
  profit_trailing: 'No Trailing' | 'Lock Fix Profit' | 'Trail Profit' | 'Lock and Trail';
  profit_reaches: number;
  lock_profit_at: number;
  every_increase_of: number;
  trail_profit_by: number;
}

interface EntryCondition {
  indicator1: string;
  comparator: string;
  indicator2: string;
  value?: number;
  period?: number;
}

interface StrategyFormData {
  name: string;
  type: 'time_based' | 'indicator_based';
  instrument?: string; // For time-based strategies
  instruments?: Array<{
    instrument_id: string;
    quantity: number;
    symbol: string;
    name: string;
  }>; // For indicator-based strategies
  order_type: 'MIS' | 'NRML' | 'CNC' | 'BTST';
  transaction_type: 'Both Side' | 'Only Long' | 'Only Short';
  chart_type: 'Candle' | 'Heikin Ashi';
  interval: '1 Min' | '3 Min' | '5 Min' | '10 Min' | '15 Min' | '30 Min' | '1H';
  start_time: string;
  square_off_time: string;
  trading_days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  order_legs?: OrderLeg[]; // For time-based strategies
  entry_conditions?: EntryCondition[]; // For indicator-based strategies
  risk_management: {
    target_on_each_script: number;
    stop_loss_on_each_script: number;
    target_sl_type: 'Percentage(%)' | 'Amount' | 'Points';
    exit_when_overall_profit_amount: number;
    exit_when_overall_loss_amount: number;
    max_trade_cycle: number;
    no_trade_after_time: string;
    profit_trailing: {
      type: 'No Trailing' | 'Lock Fix Profit' | 'Trail Profit' | 'Lock and Trail';
      profit_reaches: number | null;
      lock_profit_at: number | null;
      on_every_increase_of: number | null;
      trail_profit_by: number | null;
    };
  };
  broker?: 'angel' | 'dhan';
}

interface NewStrategyFormProps {
  onSubmit: (strategyData: StrategyFormData) => void;
  isSubmitting?: boolean;
  strategyId?: string;
  isEditMode?: boolean;
}

const NewStrategyForm: React.FC<NewStrategyFormProps> = ({
  onSubmit,
  isSubmitting = false,
  strategyId,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<StrategyFormData>({
    name: "",
    type: "time_based",
    order_type: "MIS",
    transaction_type: "Both Side",
    chart_type: "Candle",
    interval: "5 Min",
    start_time: "09:15",
    square_off_time: "15:15",
    trading_days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    risk_management: {
      target_on_each_script: 0,
      stop_loss_on_each_script: 0,
      target_sl_type: "Percentage(%)",
      exit_when_overall_profit_amount: 0,
      exit_when_overall_loss_amount: 0,
      max_trade_cycle: 1,
      no_trade_after_time: "15:15",
      profit_trailing: {
        type: "No Trailing",
        profit_reaches: null,
        lock_profit_at: null,
        on_every_increase_of: null,
        trail_profit_by: null
      }
    },
    broker: "angel"
  });

  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [orderLegs, setOrderLegs] = useState<OrderLeg[]>([]);
  const [entryConditions, setEntryConditions] = useState<EntryCondition[]>([]);
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';
  const token = Cookies.get("token");

  // Load existing strategy data when in edit mode
  useEffect(() => {
    console.log('🔍 NewStrategyForm useEffect - isEditMode:', isEditMode, 'strategyId:', strategyId);
    if (isEditMode && strategyId) {
      loadStrategyData();
    }
  }, [isEditMode, strategyId]);

  // Initialize default order leg for time-based strategies
  useEffect(() => {
    if (formData.type === 'time_based' && orderLegs.length === 0) {
      const defaultLeg: OrderLeg = {
        action: 'BUY',
        quantity: 1,
        instrument_type: 'CE',
        expiry: 'Weekly',
        strike_price_reference: 'ATM pt',
        strike_price_selection: 'ATM',
        stop_loss_percentage: 0,
        stop_loss_value: 0,
        stop_loss_type: 'On Price',
        take_profit_percentage: 0,
        take_profit_value: 0,
        take_profit_type: 'On Price',
        profit_trailing: 'No Trailing',
        profit_reaches: 0,
        lock_profit_at: 0,
        every_increase_of: 0,
        trail_profit_by: 0
      };
      setOrderLegs([defaultLeg]);
    }
  }, [formData.type]);

  const loadStrategyData = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Loading strategy data for ID:', strategyId);
      const response = await axios.get(`${base_url}/strategies/${strategyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🔍 Strategy data loaded:', response.data);

      const strategy = response.data.data;
      
      setFormData({
        name: strategy.name || "",
        type: strategy.type || "time_based",
        instrument: strategy.instrument,
        instruments: strategy.instruments,
        order_type: strategy.order_type || "MIS",
        transaction_type: strategy.transaction_type || "Both Side",
        chart_type: strategy.chart_type || "Candle",
        interval: strategy.interval || "5 Min",
        start_time: strategy.start_time || "09:15",
        square_off_time: strategy.square_off_time || "15:15",
        trading_days: strategy.trading_days || {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        order_legs: strategy.order_legs || [],
        entry_conditions: strategy.entry_conditions || [],
        risk_management: {
          target_on_each_script: strategy.risk_management?.target_on_each_script || 0,
          stop_loss_on_each_script: strategy.risk_management?.stop_loss_on_each_script || 0,
          target_sl_type: strategy.risk_management?.target_sl_type || "Percentage(%)",
          exit_when_overall_profit_amount: strategy.risk_management?.exit_when_overall_profit_amount || 0,
          exit_when_overall_loss_amount: strategy.risk_management?.exit_when_overall_loss_amount || 0,
          max_trade_cycle: strategy.risk_management?.max_trade_cycle || 1,
          no_trade_after_time: strategy.risk_management?.no_trade_after_time || "15:15",
          profit_trailing: {
            type: strategy.risk_management?.profit_trailing?.type || 
                  (typeof strategy.risk_management?.profit_trailing === 'string' ? strategy.risk_management.profit_trailing : "No Trailing"),
            profit_reaches: strategy.risk_management?.profit_trailing?.profit_reaches || 
                           strategy.risk_management?.profit_reaches || null,
            lock_profit_at: strategy.risk_management?.profit_trailing?.lock_profit_at || 
                           strategy.risk_management?.lock_profit_at || null,
            on_every_increase_of: strategy.risk_management?.profit_trailing?.on_every_increase_of || 
                                 strategy.risk_management?.every_increase_of || null,
            trail_profit_by: strategy.risk_management?.profit_trailing?.trail_profit_by || 
                            strategy.risk_management?.trail_profit_by || null
          }
        },
        broker: strategy.broker || "angel"
      });

      // Ensure order legs have all required fields
      const loadedOrderLegs = (strategy.order_legs || []).map((leg: any) => ({
        action: leg.action || 'BUY',
        quantity: leg.quantity || 1,
        instrument_type: leg.instrument_type || 'CE',
        expiry: leg.expiry || 'Weekly',
        strike_price_reference: leg.strike_price_reference || 'ATM pt',
        strike_price_selection: leg.strike_price_selection || 'ATM',
        stop_loss_percentage: leg.stop_loss_percentage || 0,
        stop_loss_value: leg.stop_loss_value || 0,
        stop_loss_type: leg.stop_loss_type || 'On Price',
        take_profit_percentage: leg.take_profit_percentage || 0,
        take_profit_value: leg.take_profit_value || 0,
        take_profit_type: leg.take_profit_type || 'On Price',
        profit_trailing: leg.profit_trailing || 'No Trailing',
        profit_reaches: leg.profit_reaches || 0,
        lock_profit_at: leg.lock_profit_at || 0,
        every_increase_of: leg.every_increase_of || 0,
        trail_profit_by: leg.trail_profit_by || 0
      }));
      
      setOrderLegs(loadedOrderLegs);
      setEntryConditions(strategy.entry_conditions || []);
      
      // Load selected instruments for display
      if (strategy.type === 'time_based' && strategy.instrument) {
        // For time-based strategies, we need to create a mock instrument object
        // since we only have the instrument ID
        const mockInstrument = {
          _id: strategy.instrument,
          symbol: strategy.instrument.split('-')[0] || 'Unknown',
          name: strategy.instrument.split('-')[0] || 'Unknown',
          exchange: strategy.instrument.split('-')[1] || 'NSE',
          segment: strategy.instrument.split('-')[2] || 'EQUITY',
          instrument_type: 'EQUITY',
          lot_size: 1,
          tick_size: 0.05,
          brokers: {
            angel: { token: strategy.instrument, tradable: true, last_updated: new Date().toISOString() },
            dhan: { token: strategy.instrument, tradable: true, last_updated: new Date().toISOString() }
          }
        };
        setSelectedInstruments([mockInstrument]);
      } else if (strategy.type === 'indicator_based' && strategy.instruments) {
        // For indicator-based strategies, create mock instruments from the instruments array
        const mockInstruments = strategy.instruments.map((inst: any) => ({
          _id: inst.instrument_id,
          symbol: inst.symbol,
          name: inst.name,
          exchange: inst.instrument_id.split('-')[1] || 'NSE',
          segment: inst.instrument_id.split('-')[2] || 'EQUITY',
          instrument_type: 'EQUITY',
          lot_size: 1,
          tick_size: 0.05,
          brokers: {
            angel: { token: inst.instrument_id, tradable: true, last_updated: new Date().toISOString() },
            dhan: { token: inst.instrument_id, tradable: true, last_updated: new Date().toISOString() }
          }
        }));
        setSelectedInstruments(mockInstruments);
      }
    } catch (error: any) {
      console.error("❌ Error loading strategy:", error);
      console.error("❌ Error details:", error.response?.data);
      alert(`Failed to load strategy: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof StrategyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNestedInputChange = (parentField: keyof StrategyFormData, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [childField]: value
      }
    }));
  };

  const handleRiskManagementChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      risk_management: {
        ...prev.risk_management,
        [field]: value
      }
    }));
  };

  const handleProfitTrailingChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      risk_management: {
        ...prev.risk_management,
        profit_trailing: {
          ...prev.risk_management.profit_trailing,
          [field]: value
        }
      }
    }));
  };

  const handleTradingDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      trading_days: {
        ...prev.trading_days,
        [day]: !prev.trading_days[day as keyof typeof prev.trading_days]
      }
    }));
  };

  const handleInstrumentSelect = (instruments: Instrument[]) => {
    console.log('Selected instruments:', instruments);
    console.log('First instrument details:', instruments[0]);
    console.log('First instrument _id:', instruments[0]?._id);
    console.log('First instrument symbol:', instruments[0]?.symbol);
    setSelectedInstruments(instruments);
    
    if (formData.type === 'time_based') {
      // For time-based strategies, use the first selected instrument
      const selectedInstrument = instruments[0];
      if (selectedInstrument) {
        // Use _id if available, otherwise create a composite ID
        const instrumentId = selectedInstrument._id || `${selectedInstrument.symbol}-${selectedInstrument.exchange}-${selectedInstrument.segment}`;
        console.log('Setting instrument ID for time-based strategy:', instrumentId);
        handleInputChange('instrument', instrumentId);
      }
    } else {
      // For indicator-based strategies, map to the required format
      const mappedInstruments = instruments.map(inst => ({
        instrument_id: inst._id || `${inst.symbol}-${inst.exchange}-${inst.segment}`,
        quantity: 1,
        symbol: inst.symbol,
        name: inst.name
      }));
      console.log('Setting instruments for indicator-based strategy:', mappedInstruments);
      handleInputChange('instruments', mappedInstruments);
    }
  };

  const addOrderLeg = () => {
    const newLeg: OrderLeg = {
      action: 'BUY',
      quantity: 1,
      instrument_type: 'CE',
      expiry: 'Weekly',
      strike_price_reference: 'ATM pt',
      strike_price_selection: 'ATM',
      stop_loss_percentage: 0,
      stop_loss_value: 0,
      stop_loss_type: 'On Price',
      take_profit_percentage: 0,
      take_profit_value: 0,
      take_profit_type: 'On Price',
      profit_trailing: 'No Trailing',
      profit_reaches: 0,
      lock_profit_at: 0,
      every_increase_of: 0,
      trail_profit_by: 0
    };
    setOrderLegs(prev => [...prev, newLeg]);
  };

  const updateOrderLeg = (index: number, field: keyof OrderLeg, value: any) => {
    setOrderLegs(prev => prev.map((leg, i) => {
      if (i === index) {
        const updatedLeg = { ...leg, [field]: value };
        
        // Reset strike_price_selection when strike_price_reference changes
        if (field === 'strike_price_reference') {
          if (value === 'ATM pt') {
            updatedLeg.strike_price_selection = 'ATM';
          } else {
            updatedLeg.strike_price_selection = '';
          }
        }
        
        return updatedLeg;
      }
      return leg;
    }));
  };

  const removeOrderLeg = (index: number) => {
    setOrderLegs(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateOrderLeg = (index: number) => {
    const legToDuplicate = orderLegs[index];
    setOrderLegs(prev => [...prev, { ...legToDuplicate }]);
  };

  const addEntryCondition = () => {
    const newCondition: EntryCondition = {
      indicator1: 'Moving Average',
      comparator: 'Crosses Above',
      indicator2: 'Price',
      value: 0,
      period: 20
    };
    setEntryConditions(prev => [...prev, newCondition]);
  };

  const updateEntryCondition = (index: number, field: keyof EntryCondition, value: any) => {
    setEntryConditions(prev => prev.map((condition, i) => 
      i === index ? { ...condition, [field]: value } : condition
    ));
  };

  const removeEntryCondition = (index: number) => {
    setEntryConditions(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Strategy name is required";
    }

    if (formData.type === 'time_based') {
      if (!formData.instrument) {
        errors.instrument = "Please select an instrument";
      }
      if (orderLegs.length === 0) {
        errors.order_legs = "At least one order leg is required";
      }
    } else {
      if (!formData.instruments || formData.instruments.length === 0) {
        errors.instruments = "Please select at least one instrument";
      }
      if (entryConditions.length === 0) {
        errors.entry_conditions = "At least one entry condition is required";
      }
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.start_time)) {
      errors.start_time = "Invalid start time format";
    }
    if (!timeRegex.test(formData.square_off_time)) {
      errors.square_off_time = "Invalid square off time format";
    }

    // Validate that start time is before square off time
    const startTime = new Date(`2000-01-01 ${formData.start_time}`);
    const squareOffTime = new Date(`2000-01-01 ${formData.square_off_time}`);
    if (startTime >= squareOffTime) {
      errors.square_off_time = "Square off time must be after start time";
    }

    // Validate that at least one trading day is selected
    const hasTradingDay = Object.values(formData.trading_days).some(day => day === true);
    if (!hasTradingDay) {
      errors.trading_days = "At least one trading day must be selected";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Additional validation for order legs
    if (formData.type === 'time_based' && orderLegs.length === 0) {
      setValidationErrors({ order_legs: "At least one order leg is required for time-based strategies" });
      return;
    }

    const submitData = {
      ...formData,
      order_legs: formData.type === 'time_based' ? orderLegs : undefined,
      entry_conditions: formData.type === 'indicator_based' ? entryConditions : undefined
    };

    console.log('Submitting strategy data:', submitData);
    console.log('Order legs being submitted:', orderLegs);
    onSubmit(submitData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading strategy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Strategy Name and Type */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Strategy Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter strategy name"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="time_based">Time Based</option>
              <option value="indicator_based">Indicator Based</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instrument Selection */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Instruments</h3>
          <button
            type="button"
            onClick={() => setIsInstrumentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {formData.type === 'time_based' ? 'Select Instrument' : 'Select Instruments'}
          </button>
        </div>

        {selectedInstruments.length > 0 ? (
          <div className="space-y-2">
            {selectedInstruments.map((instrument) => (
              <div key={instrument._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{instrument.symbol}</span>
                  <span className="text-gray-600 ml-2">({instrument.name})</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {instrument.exchange} • {instrument.segment}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInstruments(prev => prev.filter(inst => inst._id !== instrument._id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No instruments selected</p>
            <p className="text-sm">Click the button above to select instruments</p>
          </div>
        )}

        {validationErrors.instrument && (
          <p className="text-red-500 text-sm mt-2">{validationErrors.instrument}</p>
        )}
        {validationErrors.instruments && (
          <p className="text-red-500 text-sm mt-2">{validationErrors.instruments}</p>
        )}
      </div>

      {/* Basic Configuration */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type
            </label>
            <select
              value={formData.order_type}
              onChange={(e) => handleInputChange('order_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            >
              <option value="MIS">MIS</option>
              <option value="NRML" disabled>NRML (Disabled)</option>
              <option value="CNC" disabled>CNC (Disabled)</option>
              <option value="BTST" disabled>BTST (Disabled)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Only MIS order type is available for strategy creation</p>
          </div>

          {formData.type === 'indicator_based' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={formData.transaction_type}
                  onChange={(e) => handleInputChange('transaction_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Both Side">Both Side</option>
                  <option value="Only Long">Only Long</option>
                  <option value="Only Short">Only Short</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <select
                  value={formData.chart_type}
                  onChange={(e) => handleInputChange('chart_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Candle">Candle</option>
                  <option value="Heikin Ashi">Heikin Ashi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interval
                </label>
                <select
                  value={formData.interval}
                  onChange={(e) => handleInputChange('interval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1 Min">1 Min</option>
                  <option value="3 Min">3 Min</option>
                  <option value="5 Min">5 Min</option>
                  <option value="10 Min">10 Min</option>
                  <option value="15 Min">15 Min</option>
                  <option value="30 Min">30 Min</option>
                  <option value="1H">1H</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Time Configuration */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Time Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => handleInputChange('start_time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.start_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.start_time && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.start_time}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Square Off Time *
            </label>
            <input
              type="time"
              value={formData.square_off_time}
              onChange={(e) => handleInputChange('square_off_time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.square_off_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.square_off_time && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.square_off_time}</p>
            )}
          </div>
        </div>

        {/* Trading Days */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trading Days *
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData.trading_days).map(([day, selected]) => (
              <button
                key={day}
                type="button"
                onClick={() => handleTradingDayChange(day)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </div>
          {validationErrors.trading_days && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.trading_days}</p>
          )}
        </div>
      </div>

      {/* Time-based Strategy: Order Legs */}
      {formData.type === 'time_based' && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order Legs</h3>
            <button
              type="button"
              onClick={addOrderLeg}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              ADD LEG
            </button>
          </div>

          {orderLegs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No order legs configured</p>
              <p className="text-sm">Add order legs to define your trading strategy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderLegs.map((leg, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Leg {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => duplicateOrderLeg(index)}
                        className="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded"
                        title="Duplicate leg"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOrderLeg(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Remove leg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Controls Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {/* Action Button */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateOrderLeg(index, 'action', leg.action === 'BUY' ? 'SELL' : 'BUY')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          leg.action === 'SELL' 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        } hover:opacity-80`}
                      >
                        {leg.action}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOrderLeg(index, 'action', leg.action === 'BUY' ? 'SELL' : 'BUY')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">Qty</span>
                      <input
                        type="number"
                        value={leg.quantity}
                        onChange={(e) => updateOrderLeg(index, 'quantity', parseInt(e.target.value) ||'')}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                        placeholder="0"
                      />
                    </div>

                    {/* Instrument Type Button */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateOrderLeg(index, 'instrument_type', leg.instrument_type === 'CE' ? 'PE' : 'CE')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          leg.instrument_type === 'PE' 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        } hover:opacity-80`}
                      >
                        {leg.instrument_type}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOrderLeg(index, 'instrument_type', leg.instrument_type === 'CE' ? 'PE' : 'CE')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Expiry Button */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const expiryOptions = ['Weekly', 'Monthly'];
                          const currentIndex = expiryOptions.indexOf(leg.expiry);
                          const nextIndex = (currentIndex + 1) % expiryOptions.length;
                          updateOrderLeg(index, 'expiry', expiryOptions[nextIndex]);
                        }}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200 hover:opacity-80"
                      >
                        {leg.expiry}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const expiryOptions = ['Weekly', 'Monthly'];
                          const currentIndex = expiryOptions.indexOf(leg.expiry);
                          const nextIndex = (currentIndex + 1) % expiryOptions.length;
                          updateOrderLeg(index, 'expiry', expiryOptions[nextIndex]);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Strike Reference Dropdown */}
                    <select
                      value={leg.strike_price_reference}
                      onChange={(e) => updateOrderLeg(index, 'strike_price_reference', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ATM pt">ATM pt</option>
                      {/* <option value="ATM %">ATM %</option> */}
                      <option value="CP">CP</option>
                      <option value="CP >=">CP &gt;=</option>
                      <option value="CP <=">CP &lt;=</option>
                    </select>

                    {/* Strike Selection - Conditional based on Strike Reference */}
                    {leg.strike_price_reference === 'ATM pt' ? (
                      <select
                        value={leg.strike_price_selection}
                        onChange={(e) => updateOrderLeg(index, 'strike_price_selection', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                       
                     
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={`ITM${i}`} value={`ITM ${(i + 1) * 100}`}>
                            ITM {(i + 1) * 100}
                          </option>
                        ))}

                        <option value="ATM">ATM</option>
                     
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={`OTM${i}`} value={`OTM ${(i + 1) * 100}`}>
                            OTM {(i + 1) * 100}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={leg.strike_price_selection || ''}
                        onChange={(e) => updateOrderLeg(index, 'strike_price_selection', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Strike"
                        step="0.05"
                      />
                    )}

                    {/* Stop Loss Percentage */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">SL %</span>
                      <input
                        type="number"
                        value={leg.stop_loss_percentage || ''}
                        onChange={(e) => updateOrderLeg(index, 'stop_loss_percentage', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                        placeholder="0"
                      />
                    </div>

                    {/* Stop Loss Type */}
                    <select
                      value={leg.stop_loss_type}
                      onChange={(e) => updateOrderLeg(index, 'stop_loss_type', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="On Price">On Price</option>
                      <option value="On Percentage">On %</option>
                      <option value="On Points">On Points</option>
                    </select>

                    {/* Take Profit Percentage */}
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">TP %</span>
                      <input
                        type="number"
                        value={leg.take_profit_percentage || ''}
                        onChange={(e) => updateOrderLeg(index, 'take_profit_percentage', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.1"
                        placeholder="0"
                      />
                    </div>

                    {/* Take Profit Type */}
                    <select
                      value={leg.take_profit_type}
                      onChange={(e) => updateOrderLeg(index, 'take_profit_type', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="On Price">On Price</option>
                      <option value="On Percentage">On %</option>
                      <option value="On Points">On Points</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {validationErrors.order_legs && (
            <p className="text-red-500 text-sm mt-2">{validationErrors.order_legs}</p>
          )}
        </div>
      )}

      {/* Indicator-based Strategy: Entry Conditions */}
      {formData.type === 'indicator_based' && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Entry Conditions</h3>
            <button
              type="button"
              onClick={addEntryCondition}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Condition
            </button>
          </div>

          {entryConditions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No entry conditions configured</p>
              <p className="text-sm">Add entry conditions to define when to enter trades</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entryConditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Condition {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEntryCondition(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Indicator 1</label>
                      <select
                        value={condition.indicator1}
                        onChange={(e) => updateEntryCondition(index, 'indicator1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Moving Average">Moving Average</option>
                        <option value="VWAP">VWAP</option>
                        <option value="MACD">MACD</option>
                        <option value="RSI">RSI</option>
                        <option value="SuperTrend">SuperTrend</option>
                        <option value="Price">Price</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comparator</label>
                      <select
                        value={condition.comparator}
                        onChange={(e) => updateEntryCondition(index, 'comparator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Crosses Above">Crosses Above</option>
                        <option value="Crosses Below">Crosses Below</option>
                        <option value="Higher than">Higher than</option>
                        <option value="Less than">Less than</option>
                        <option value="Equal">Equal</option>
                        <option value="Not Equal">Not Equal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Indicator 2</label>
                      <select
                        value={condition.indicator2}
                        onChange={(e) => updateEntryCondition(index, 'indicator2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Moving Average">Moving Average</option>
                        <option value="VWAP">VWAP</option>
                        <option value="MACD">MACD</option>
                        <option value="RSI">RSI</option>
                        <option value="SuperTrend">SuperTrend</option>
                        <option value="Price">Price</option>
                        <option value="Number">Number</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value/Period</label>
                      <input
                        type="number"
                        value={condition.value || condition.period || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (condition.indicator1 === 'Moving Average' || condition.indicator2 === 'Moving Average') {
                            updateEntryCondition(index, 'period', value);
                          } else {
                            updateEntryCondition(index, 'value', value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Value or period"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {validationErrors.entry_conditions && (
            <p className="text-red-500 text-sm mt-2">{validationErrors.entry_conditions}</p>
          )}
        </div>
      )}

      {/* Risk Management */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Risk Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">Configure your trading risk parameters and profit trailing strategies</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Overall Profit/Loss Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Overall Exit Conditions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Exit When Over All Profit In Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.risk_management.exit_when_overall_profit_amount || ''}
                    onChange={(e) => handleRiskManagementChange('exit_when_overall_profit_amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    min="0"
                    placeholder="Enter profit amount"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-green-600 text-sm font-medium">₹</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Exit When Over All Loss In Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.risk_management.exit_when_overall_loss_amount || ''}
                    onChange={(e) => handleRiskManagementChange('exit_when_overall_loss_amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                    min="0"
                    placeholder="Enter loss amount"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-red-600 text-sm font-medium">₹</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* No Trade After Time */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Trading Time Restrictions
            </h4>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Trade After
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.risk_management.no_trade_after_time}
                  onChange={(e) => handleRiskManagementChange('no_trade_after_time', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
                <Clock className="w-5 h-5 absolute right-4 top-3.5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Profit Trailing Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Profit Trailing
            </h4>
            
            {/* Trailing Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center p-3 bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
                   onClick={() => handleProfitTrailingChange('type', 'No Trailing')}>
                <input
                  type="radio"
                  id="no-trailing"
                  name="profit-trailing"
                  value="No Trailing"
                  checked={formData.risk_management.profit_trailing.type === 'No Trailing'}
                  onChange={(e) => handleProfitTrailingChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="no-trailing" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  No Trailing
                </label>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
                   onClick={() => handleProfitTrailingChange('type', 'Lock Fix Profit')}>
                <input
                  type="radio"
                  id="lock-fix-profit"
                  name="profit-trailing"
                  value="Lock Fix Profit"
                  checked={formData.risk_management.profit_trailing.type === 'Lock Fix Profit'}
                  onChange={(e) => handleProfitTrailingChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="lock-fix-profit" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Lock Fix Profit
                </label>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
                   onClick={() => handleProfitTrailingChange('type', 'Trail Profit')}>
                <input
                  type="radio"
                  id="trail-profit"
                  name="profit-trailing"
                  value="Trail Profit"
                  checked={formData.risk_management.profit_trailing.type === 'Trail Profit'}
                  onChange={(e) => handleProfitTrailingChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="trail-profit" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Trail Profit
                </label>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
                   onClick={() => handleProfitTrailingChange('type', 'Lock and Trail')}>
                <input
                  type="radio"
                  id="lock-and-trail"
                  name="profit-trailing"
                  value="Lock and Trail"
                  checked={formData.risk_management.profit_trailing.type === 'Lock and Trail'}
                  onChange={(e) => handleProfitTrailingChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="lock-and-trail" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Lock and Trail
                </label>
              </div>
            </div>

            {/* Profit Threshold Inputs - Show based on selected option */}
            {formData.risk_management.profit_trailing.type === 'Lock Fix Profit' && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      If Profit Reaches
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.profit_reaches || ''}
                        onChange={(e) => handleProfitTrailingChange('profit_reaches', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        min="0"
                        placeholder="Enter profit threshold"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-blue-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lock Profit at
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.lock_profit_at || ''}
                        onChange={(e) => handleProfitTrailingChange('lock_profit_at', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        min="0"
                        placeholder="Enter lock amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-blue-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.risk_management.profit_trailing.type === 'Trail Profit' && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      On Every increase of
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.on_every_increase_of || ''}
                        onChange={(e) => handleProfitTrailingChange('on_every_increase_of', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                        min="0"
                        step="0.1"
                        placeholder="Enter increment value"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-purple-600 text-sm font-medium">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Trail Profit By
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.trail_profit_by || ''}
                        onChange={(e) => handleProfitTrailingChange('trail_profit_by', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                        min="0"
                        step="0.1"
                        placeholder="Enter trail amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-purple-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.risk_management.profit_trailing.type === 'Lock and Trail' && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      If Profit Reaches
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.profit_reaches || ''}
                        onChange={(e) => handleProfitTrailingChange('profit_reaches', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white"
                        min="0"
                        placeholder="Enter threshold"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-pink-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lock Profit at
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.lock_profit_at || ''}
                        onChange={(e) => handleProfitTrailingChange('lock_profit_at', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white"
                        min="0"
                        placeholder="Enter lock amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-pink-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Every Increase In Prc
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.on_every_increase_of || ''}
                        onChange={(e) => handleProfitTrailingChange('on_every_increase_of', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white"
                        min="0"
                        step="0.1"
                        placeholder="Enter increment"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-pink-600 text-sm font-medium">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Trail Profit By
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.risk_management.profit_trailing.trail_profit_by || ''}
                        onChange={(e) => handleProfitTrailingChange('trail_profit_by', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white"
                        min="0"
                        step="0.1"
                        placeholder="Enter trail amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-pink-600 text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditMode ? "Update Strategy" : "Create Strategy"}
            </>
          )}
        </button>
      </div>

      {/* Instruments Selection Modal */}
      <InstrumentsSelectionModal
        isOpen={isInstrumentModalOpen}
        onClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstruments={handleInstrumentSelect}
        initiallySelected={selectedInstruments}
        strategyType={formData.type}
        selectedBroker="angel"
      />
    </div>
  );
};

export default NewStrategyForm;
