"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"

// Dummy data for the line chart
const data = [
  { date: "May 14", profit: 1200 },
  { date: "May 15", profit: 1800 },
  { date: "May 16", profit: 1600 },
  { date: "May 17", profit: 2200 },
  { date: "May 18", profit: 1900 },
  { date: "May 19", profit: 2800 },
  { date: "May 20", profit: 2400 },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-gray-200 bg-white p-2 text-gray-800 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Date</span>
                      <span className="font-bold text-gray-900">{payload[0].payload.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Profit</span>
                      <span className="font-bold text-green-600">${payload[0].value}</span>
                    </div>
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#3b82f6"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#3b82f6", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
