// Strategy Type Component
const StrategyTypeSelector = ({ strategyType, onStrategyTypeChange }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Strategy Type</h2>
    <div className="flex gap-4">
      {["Time Based", "Indicator Based"].map((type) => {
        const isDisabled = false; // Enable both strategy types
        const isSelected = strategyType === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => !isDisabled && onStrategyTypeChange(type)}
            disabled={isDisabled}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isSelected
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {type}
          </button>
        );
      })}
    </div>
  </div>
);

export default StrategyTypeSelector;
