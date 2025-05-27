"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"

// Dummy data for the pie chart
const data = [
  { name: "Momentum", value: 35 },
  { name: "Mean Reversion", value: 25 },
  { name: "Breakout", value: 20 },
  { name: "Trend Following", value: 15 },
  { name: "Other", value: 5 },
]

// Colors for the pie chart - blue shades
const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]

export function DashboardPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-gray-200 bg-white p-2 text-gray-800 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Strategy</span>
                      <span className="font-bold text-gray-900">{payload[0].name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Percentage</span>
                      <span className="font-bold text-gray-900">{payload[0].value}%</span>
                    </div>
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
