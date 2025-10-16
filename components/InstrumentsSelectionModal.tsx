"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2, Check, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";

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

interface InstrumentsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstruments: (instruments: Instrument[]) => void;
  initiallySelected?: Instrument[];
  strategyType: 'time_based' | 'indicator_based';
  selectedBroker?: string;
}

const InstrumentsSelectionModal: React.FC<InstrumentsSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectInstruments,
  initiallySelected = [],
  strategyType,
  selectedBroker = 'angel'
}) => {
  const [selectedCategory, setSelectedCategory] = useState("options");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(initiallySelected);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';
  const token = Cookies.get("token");

  const categories = [
    { id: "options", name: "Options", icon: "📊" },
    { id: "equity", name: "Equity", icon: "📈" },
    { id: "futures", name: "Futures", icon: "⏰" },
    { id: "indices", name: "Indices", icon: "📋" }
  ];

  // Fetch instruments by category
  const fetchInstruments = useCallback(async (category: string, pageNum: number = 1, search: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "50",
        broker: selectedBroker
      });

      if (search) {
        params.append("query", search);
      }

      // Add strategyType parameter for time-based strategies
      if (strategyType === 'time_based') {
        params.append("strategyType", "time_based");
      }

      const response = await axios.get(
        `${base_url}/instruments/category/${category}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const newInstruments = response.data.data || [];
      
      if (pageNum === 1) {
        setInstruments(newInstruments);
      } else {
        setInstruments(prev => [...prev, ...newInstruments]);
      }

      setHasMore(newInstruments.length === 50);
      setPage(pageNum);
    } catch (err: any) {
      console.error("Error fetching instruments:", err);
      setError(err.response?.data?.message || "Failed to fetch instruments");
    } finally {
      setLoading(false);
    }
  }, [base_url, token, selectedBroker]);

  // Search instruments
  const searchInstruments = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchInstruments(selectedCategory, 1, "");
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const params = new URLSearchParams({
        query,
        category: selectedCategory,
        page: "1",
        limit: "50",
        broker: selectedBroker
      });

      const response = await axios.get(
        `${base_url}/instruments/search?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInstruments(response.data.data || []);
      setPage(1);
      setHasMore(false);
    } catch (err: any) {
      console.error("Error searching instruments:", err);
      setError(err.response?.data?.message || "Failed to search instruments");
    } finally {
      setSearchLoading(false);
    }
  }, [base_url, token, selectedCategory, selectedBroker, fetchInstruments]);

  // Load more instruments
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !searchTerm) {
      fetchInstruments(selectedCategory, page + 1);
    }
  }, [loading, hasMore, searchTerm, selectedCategory, page, fetchInstruments]);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setPage(1);
    setHasMore(true);
    fetchInstruments(category, 1, "");
  }, [fetchInstruments]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchInstruments(searchTerm);
      } else {
        fetchInstruments(selectedCategory, 1, "");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchInstruments, selectedCategory, fetchInstruments]);

  // Load instruments when modal opens
  useEffect(() => {
    if (isOpen) {
      // For time-based strategies, force selection to options
      if (strategyType === 'time_based' && selectedCategory !== 'options') {
        setSelectedCategory('options');
        fetchInstruments('options', 1, "");
      } else {
        fetchInstruments(selectedCategory, 1, "");
      }
    }
  }, [isOpen, fetchInstruments, selectedCategory, strategyType]);

  // Update selected instruments when initiallySelected changes
  useEffect(() => {
    setSelectedInstruments(initiallySelected);
  }, [initiallySelected]);

  const handleInstrumentSelect = (instrument: Instrument) => {
    if (strategyType === 'time_based') {
      // Single selection for time-based strategies
      setSelectedInstruments([instrument]);
    } else {
      // Multiple selection for indicator-based strategies
      setSelectedInstruments(prev => {
        const instrumentKey = `${instrument.symbol}-${instrument.exchange}-${instrument.segment}`;
        const isSelected = prev.some(inst => {
          const selectedKey = `${inst.symbol}-${inst.exchange}-${inst.segment}`;
          return selectedKey === instrumentKey;
        });
        
        if (isSelected) {
          const newSelection = prev.filter(inst => {
            const selectedKey = `${inst.symbol}-${inst.exchange}-${inst.segment}`;
            return selectedKey !== instrumentKey;
          });
          return newSelection;
        } else {
          const newSelection = [...prev, instrument];
          return newSelection;
        }
      });
    }
  };

  const handleConfirm = () => {
    onSelectInstruments(selectedInstruments);
    onClose();
  };

  const isInstrumentSelected = (instrument: Instrument) => {
    // Create a unique identifier since _id might be undefined
    const instrumentKey = `${instrument.symbol}-${instrument.exchange}-${instrument.segment}`;
    const isSelected = selectedInstruments.some(inst => {
      const selectedKey = `${inst.symbol}-${inst.exchange}-${inst.segment}`;
      return selectedKey === instrumentKey;
    });
    return isSelected;
  };

  const getBrokerStatus = (instrument: Instrument) => {
    // For time-based strategies, always show as available since they're for backtesting
    if (strategyType === 'time_based') {
      return "Available";
    }
    
    // For indicator-based strategies, check broker availability
    if (!instrument.brokers || !selectedBroker) {
      return "Available";
    }
    
    const brokerData = instrument.brokers[selectedBroker as keyof typeof instrument.brokers];
    return brokerData?.tradable ? "Available" : "Not Available";
  };

  const getBrokerStatusColor = (instrument: Instrument) => {
    // For time-based strategies, always show green since they're for backtesting
    if (strategyType === 'time_based') {
      return "text-green-600";
    }
    
    // For indicator-based strategies, check broker availability
    if (!instrument.brokers || !selectedBroker) {
      return "text-green-600";
    }
    
    const brokerData = instrument.brokers[selectedBroker as keyof typeof instrument.brokers];
    return brokerData?.tradable ? "text-green-600" : "text-red-600";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Select Instruments</h2>
              <p className="text-sm text-gray-600 mt-1">
                {strategyType === 'time_based' ? 'Select one options instrument for your time-based strategy (only options are available for time-based strategies)' : 'Select multiple instruments for your indicator-based strategy'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search instruments by symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchLoading && (
              <Loader2 className="w-4 h-4 absolute right-3 top-3 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map((category) => {
              // For time-based strategies, only allow options
              const isDisabled = strategyType === 'time_based' && category.id !== 'options';
              
              return (
                <button
                  key={category.id}
                  onClick={() => !isDisabled && handleCategoryChange(category.id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    isDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                  {isDisabled && <span className="text-xs">(Disabled)</span>}
                </button>
              );
            })}
          </div>

          {/* Selected count and summary */}
          {selectedInstruments.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-600 font-medium">
                {selectedInstruments.length} instrument{selectedInstruments.length !== 1 ? 's' : ''} selected: {selectedInstruments.map(inst => inst.symbol).join(', ')}
              </div>
              <button
                onClick={() => setSelectedInstruments([])}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Instruments List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading && page === 1 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading instruments...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchInstruments(selectedCategory, 1, searchTerm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : instruments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No instruments found matching your search." : "No instruments available in this category."}
            </div>
          ) : (
            <div className="space-y-2">
              {instruments.map((instrument) => {
                const isSelected = isInstrumentSelected(instrument);
                const brokerStatus = getBrokerStatus(instrument);
                const brokerStatusColor = getBrokerStatusColor(instrument);
                

                return (
                  <div
                    key={instrument._id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleInstrumentSelect(instrument)}
                  >
                    <div className="flex-shrink-0">
                      {strategyType === 'time_based' ? (
                        <div 
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-600' 
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-600' 
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {instrument.symbol}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${brokerStatusColor} bg-opacity-10`}>
                          {brokerStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{instrument.name}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>{instrument.exchange}</span>
                        <span>{instrument.segment}</span>
                        <span>Lot: {instrument.lot_size}</span>
                        {instrument.strike_price && (
                          <span>Strike: {instrument.strike_price}</span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-xs text-blue-600 font-medium">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Load more button */}
              {hasMore && !searchTerm && (
                <div className="text-center py-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedInstruments.length > 0 ? (
              <div>
                <span className="font-medium">Selected: </span>
                {selectedInstruments.map(inst => inst.symbol).join(", ")}
              </div>
            ) : (
              "No instruments selected"
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedInstruments.length === 0}
              className={`px-4 py-2 rounded-lg ${
                selectedInstruments.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {strategyType === 'time_based' ? 'Select Instrument' : `Select ${selectedInstruments.length} Instrument${selectedInstruments.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentsSelectionModal;
