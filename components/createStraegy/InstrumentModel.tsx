import React, { useState } from "react";
import { X, Search } from "lucide-react";

// Modal Component for Instrument Selection
const InstrumentModal = ({ isOpen, onClose, onSelectInstruments }) => {
  const [selectedCategory, setSelectedCategory] = useState("Options");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState(["NIFTY50"]);

  const categories = ["Options", "Equity", "Futures", "Indices", "CDS", "MCX"];

  const instruments = {
    Options: ["NIFTY50", "NIFTYBANK", "NIFTYFIN SERVICE", "SENSEX"],
    Equity: ["RELIANCE", "TCS", "HDFC BANK", "INFOSYS", "ICICI BANK"],
    Futures: ["NIFTY FUT", "BANKNIFTY FUT", "CRUDE OIL", "GOLD"],
    Indices: ["NIFTY 50", "SENSEX", "NIFTY BANK", "NIFTY IT"],
    CDS: ["USD-INR", "EUR-INR", "GBP-INR", "JPY-INR"],
    MCX: ["GOLD", "SILVER", "CRUDE OIL", "COPPER"]
  };

  const filteredInstruments =
    instruments[selectedCategory]?.filter((instrument) =>
      instrument.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleConfirm = () => {
    onSelectInstruments(selectedInstruments);
    onClose();
    setSearchTerm("");
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
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map((category) => {
              const isDisabled = category !== "Options";
              return (
                <button
                  key={category}
                  onClick={() => !isDisabled && setSelectedCategory(category)}
                  disabled={isDisabled}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instruments */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {filteredInstruments.map((instrument) => {
              const isEnabled =
                selectedCategory === "Options" && instrument === "NIFTY50";
              const isChecked = selectedInstruments.includes(instrument);

              return (
                <label
                  key={instrument}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                    !isEnabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="instrument"
                    checked={isChecked}
                    disabled={!isEnabled}
                    onChange={() => {
                      if (isEnabled) setSelectedInstruments([instrument]);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{instrument}</span>
                </label>
              );
            })}
          </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
