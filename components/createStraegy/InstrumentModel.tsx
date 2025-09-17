import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useInstruments } from "@/hooks/useInstruments";

interface InstrumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstruments: (instruments: string[]) => void;
  initiallySelected?: string[];
}

// Modal Component for Instrument Selection
const InstrumentModal: React.FC<InstrumentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectInstruments, 
  initiallySelected = [] 
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Options");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(initiallySelected);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [allInstrumentsLoaded, setAllInstrumentsLoaded] = useState<Record<string, boolean>>({});
  const [allInstruments, setAllInstruments] = useState<Record<string, string[]>>({});

  const {
    instrumentsData,
    loading,
    error,
    fetchInstruments,
    searchInstruments,
    getAllInstrumentsForCategory,
    getCurrentCategoryInstruments,
    getAvailableCategories
  } = useInstruments();

  const categories = ["Options", "Equity", "Futures", "Indices"];

  // Fetch instruments data from API when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchInstruments();
    }
  }, [isOpen]);

  // Update selected instruments when initiallySelected changes
  useEffect(() => {
    setSelectedInstruments(initiallySelected);
  }, [initiallySelected]);

  // Handle search with debouncing and lazy loading
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        
        // For Equity and Futures, load all instruments if not already loaded
        if ((selectedCategory === 'Equity' || selectedCategory === 'Futures') && !allInstrumentsLoaded[selectedCategory]) {
          try {
            const allInstrumentsForCategory = await getAllInstrumentsForCategory(selectedCategory.toLowerCase());
            setAllInstruments(prev => ({
              ...prev,
              [selectedCategory]: allInstrumentsForCategory
            }));
            setAllInstrumentsLoaded(prev => ({
              ...prev,
              [selectedCategory]: true
            }));
          } catch (error) {
            console.error('Error loading all instruments:', error);
          }
        }
        
        // Perform search
        const results = await searchInstruments(searchTerm, selectedCategory);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, allInstrumentsLoaded, getAllInstrumentsForCategory]);

  // Get instruments for current category with memoization
  const getCurrentCategoryInstrumentsList = useCallback((): string[] => {
    if (searchTerm.trim() && searchResults.length > 0) {
      return searchResults;
    }
    
    // For Equity and Futures, if all instruments are loaded, use them for search
    if ((selectedCategory === 'Equity' || selectedCategory === 'Futures') && allInstrumentsLoaded[selectedCategory]) {
      return allInstruments[selectedCategory] || [];
    }
    
    return getCurrentCategoryInstruments(selectedCategory);
  }, [searchTerm, searchResults, selectedCategory, getCurrentCategoryInstruments, allInstrumentsLoaded, allInstruments]);

  // Memoized filtered instruments
  const filteredInstruments = useMemo(() => {
    const instruments = getCurrentCategoryInstrumentsList();
    if (searchTerm.trim()) {
      return instruments.filter((instrument: any) => {
        // Handle both string instruments and object instruments
        const instrumentStr = typeof instrument === 'string' ? instrument : instrument.symbol || instrument.name || '';
        return instrumentStr.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    return instruments;
  }, [getCurrentCategoryInstrumentsList, searchTerm]);

  // Memoized displayed instruments to avoid infinite re-renders
  const displayedInstruments = useMemo(() => {
    return filteredInstruments.slice(0, visibleCount);
  }, [filteredInstruments, visibleCount]);

  // Load more instruments
  const loadMoreInstruments = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 50, filteredInstruments.length));
  }, [filteredInstruments.length]);

  // Toggle category expansion
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const handleConfirm = () => {
    onSelectInstruments(selectedInstruments);
    onClose();
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleInstrumentSelect = (instrument: string) => {
    // Allow only single selection
    setSelectedInstruments([instrument]);
  };

  const handleLoadAllInstruments = async () => {
    if (allInstrumentsLoaded[selectedCategory]) return;
    
    setIsSearching(true);
    try {
      const allInstrumentsForCategory = await getAllInstrumentsForCategory(selectedCategory.toLowerCase());
      setAllInstruments(prev => ({
        ...prev,
        [selectedCategory]: allInstrumentsForCategory
      }));
      setAllInstrumentsLoaded(prev => ({
        ...prev,
        [selectedCategory]: true
      }));
    } catch (error) {
      console.error('Error loading all instruments:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Instrument</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search script: ie. - State Bank Of India, Banknifty, Crudeoil"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-3 top-3 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Load All button for Equity and Futures */}
          {/* {(selectedCategory === 'Equity' || selectedCategory === 'Futures') && !allInstrumentsLoaded[selectedCategory] && (
            <div className="mb-4">
              <button
                onClick={handleLoadAllInstruments}
                disabled={isSearching}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
              >
                {isSearching ? 'Loading...' : `Load All ${selectedCategory} Instruments`}
              </button>
            </div>
          )} */}
        </div>

        {/* Instruments */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading instruments...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInstruments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInstruments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No instruments found matching your search." : "No instruments available in this category."}
                </div>
              ) : (
                <>
                  {/* Displayed instruments */}
                  {displayedInstruments.map((instrument: any) => {
                    // Handle both string instruments and object instruments
                    const instrumentStr = typeof instrument === 'string' ? instrument : instrument.symbol || instrument.name || '';
                    const isChecked = selectedInstruments.includes(instrumentStr);

                    return (
                      <label
                        key={instrumentStr}
                        className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="instrument"
                          checked={isChecked}
                          onChange={() => handleInstrumentSelect(instrumentStr)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{instrumentStr}</span>
                      </label>
                    );
                  })}
                  
                  {/* Load more button */}
                  {displayedInstruments.length < filteredInstruments.length && (
                    <div className="text-center py-4">
                      <button
                        onClick={loadMoreInstruments}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Load More ({filteredInstruments.length - displayedInstruments.length} remaining)
                      </button>
                    </div>
                  )}
                  
                  {/* Results summary */}
                  <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    Showing {displayedInstruments.length} of {filteredInstruments.length} instruments
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedInstruments.length > 0 ? `${selectedInstruments[0]}` : 'No instrument selected'}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
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
              Select Instrument
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentModal;
