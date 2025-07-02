import { Clock, Info } from "lucide-react";

// Risk Management Component
const RiskManagement = ({ formData, onInputChange }) => (
  <div className="border border-gray-200 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-lg font-semibold">Risk management</h3>
      <Info className="w-4 h-4 text-gray-400" />
    </div>
    <div className="grid grid-cols-4 gap-4">
      <div>
        <input
          type="text"
          placeholder="Exit When Over All Profit In Amount (INR)"
          value={formData.maxProfit}
          onChange={(e) => onInputChange('maxProfit', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Exit When Over All Loss In Amount(INR)"
          value={formData.maxLoss}
          onChange={(e) => onInputChange('maxLoss', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <label className="block text-sm text-gray-600 mb-1 absolute -top-3 left-3 bg-white">Max Trade Cycle</label>
        <input
          type="text"
          value={formData.maxTradeCycle}
          onChange={(e) => onInputChange('maxTradeCycle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <label className="block text-sm text-gray-600 mb-1 absolute -top-3 left-3 bg-white">No Trade After</label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={formData.noTradeAfter}
            onChange={(e) => onInputChange('noTradeAfter', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
);

export default RiskManagement;