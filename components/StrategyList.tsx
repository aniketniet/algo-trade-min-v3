import React from "react";
import { Target, Play, Pause, TrendingDown } from "lucide-react";
import { useStrategiesList } from "@/hooks/useStrategyApi";


const StrategyList = () => {
  const { strategies, loading, error } = useStrategiesList();

  if (loading) {
    return <div className="text-center py-8">Loading strategies...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!strategies || strategies.length === 0) {
    return <div className="text-center py-8">No strategies found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Trading Strategies</h1>
          <p className="text-gray-600">
            Manage and monitor your algorithmic trading strategies
          </p>
        </div>
      </div>

      {/* Strategies List */}
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div
            key={strategy._id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{strategy.strategyName}</h3>
                  <p className="text-sm text-gray-600">
                    {strategy.strategyType} • {strategy.instruments.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    strategy.status === "active"
                      ? "border-green-200 text-green-700 bg-green-50"
                      : strategy.status === "paused"
                      ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                      : "border-red-200 text-red-700 bg-red-50"
                  }`}
                >
                  {strategy.status === "active" ? (
                    <Play className="w-3 h-3" />
                  ) : strategy.status === "paused" ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {strategy.status}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-semibold">{strategy.orderType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trading Hours</p>
                  <p className="font-semibold">
                    {strategy.startTime} - {strategy.squareOffTime}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Max Profit</p>
                  <p className="font-semibold">₹{strategy.riskManagement.exitWhenProfit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Loss</p>
                  <p className="font-semibold">₹{strategy.riskManagement.exitWhenLoss}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Profit Trailing</p>
                  <p className="font-semibold">{strategy.profitTrailing}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mode</p>
                  <p className="font-semibold capitalize">{strategy.mode}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm text-gray-500">
                    {new Date(strategy.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-sm text-gray-500">{strategy.__v}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyList;