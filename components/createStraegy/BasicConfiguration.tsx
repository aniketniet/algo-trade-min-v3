const BasicConfiguration = ({ formData, onInputChange, onToggleDay }) => {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const orderTypes = ["MIS", "CNC", "BTST"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Order Type */}
      <div>
        <h4 className="font-medium mb-2">Order Type</h4>
        <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-4">
          {orderTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="orderType"
                value={type}
                checked={formData.orderType === type}
                onChange={(e) => onInputChange("orderType", e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Start Time & Square Off */}
      <div className="flex gap-3 items-center">
        <div>
          <h4 className="font-medium mb-2">Start time</h4>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => onInputChange("startTime", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <h4 className="font-medium mb-2">Square off</h4>
          <input
            type="time"
            value={formData.squareOff}
            onChange={(e) => onInputChange("squareOff", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Trading Days */}
      <div>
        <h4 className="font-medium mb-3">Trading Days</h4>
        <div className="flex flex-wrap gap-1">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onToggleDay(day)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                formData.selectedDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicConfiguration;
