// Time Based Strategy Component
const TimeBasedStrategy = ({ formData, onInputChange }) => {
  const transactionTypes = ["Both Side", "Only Long", "Only Short"];
  const chartTypes = ["Candle", "Heikin Ashi"];
  const intervals = ["1 Min", "3 Min", "5 Min", "10 Min", "15 Min", "30 Min", "1 Hr"];

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-6">
        {/* Transaction Type */}
        {/* <div>
          <h4 className="font-medium mb-3">Transaction type</h4>
          <div className="space-y-2">
            {transactionTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transactionType"
                  value={type}
                  checked={formData.transactionType === type}
                  onChange={(e) => onInputChange('transactionType', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* Chart Type */}
        {/* <div>
          <h4 className="font-medium mb-3">Chart type</h4>
          <div className="space-y-2">
            {chartTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="chartType"
                  value={type}
                  checked={formData.chartType === type}
                  onChange={(e) => onInputChange('chartType', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* Interval */}
        {/* <div>
          <h4 className="font-medium mb-3">Interval</h4>
          <div className="grid grid-cols-2 gap-1">
            {intervals.map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => onInputChange('interval', interval)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  formData.interval === interval
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {interval}
              </button>
            ))}
          </div>
        </div> */}
       
      </div>
         <div className=" flex justify-between border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Legs</h3>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Add leg +
        </button>
      </div>
    </div>
  );
};

export default TimeBasedStrategy;