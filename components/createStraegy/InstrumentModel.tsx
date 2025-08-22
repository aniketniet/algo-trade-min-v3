import React, { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
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

  const {
    instrumentsData,
    loading,
    error,
    fetchInstruments,
    searchInstruments,
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

  // Handle search with debouncing
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        const results = await searchInstruments(searchTerm, selectedCategory);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  // Get instruments for current category
  const getCurrentCategoryInstrumentsList = (): string[] => {
    if (searchTerm.trim() && searchResults.length > 0) {
      return searchResults;
    }
    return getCurrentCategoryInstruments(selectedCategory);
  };

  // Filter instruments based on search term (for local filtering)
  const filteredInstruments = getCurrentCategoryInstrumentsList().filter((instrument: string) =>
    instrument.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    onSelectInstruments(selectedInstruments);
    onClose();
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleInstrumentSelect = (instrument: string) => {
    // Allow multiple selection
    if (selectedInstruments.includes(instrument)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
    } else {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Instruments</h2>
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
                filteredInstruments.map((instrument: string) => {
                  const isChecked = selectedInstruments.includes(instrument);

                  return (
                    <label
                      key={instrument}
                      className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="instrument"
                        checked={isChecked}
                        onChange={() => handleInstrumentSelect(instrument)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{instrument}</span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedInstruments.length} instrument selected
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
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentModal;
