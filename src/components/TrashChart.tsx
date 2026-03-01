"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TrashChartProps {
  data: { city: string; score: number }[];
}

function getBarColor(score: number): string {
  if (score >= 80) return "#ef4444"; // red
  if (score >= 60) return "#f97316"; // orange
  if (score >= 40) return "#eab308"; // yellow
  return "#a3e635"; // lime
}

export default function TrashChart({ data }: TrashChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
      >
        <XAxis
          dataKey="city"
          tick={{ fill: "#a1a1aa", fontSize: 13, fontWeight: 600, dy: 20, dx: -20 } as Record<string, unknown>}
          angle={-45}
          textAnchor="end"
          interval={0}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={{ stroke: "#3f3f46" }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#a1a1aa", fontSize: 13 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={{ stroke: "#3f3f46" }}
          label={{
            value: "Dump Score %",
            angle: -90,
            position: "center",
            dx: -20,
            style: { fill: "#71717a", fontSize: 15, fontWeight: 700 },
          }}
        />
        <Tooltip
          cursor={{ fill: "rgba(163,230,53,0.08)" }}
          contentStyle={{
            background: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: 10,
            color: "#ffffff",
            fontWeight: 700,
          }}
          labelStyle={{ color: "#ffffff", fontWeight: 800 }}
          itemStyle={{ color: "#ffffff" }}
          formatter={(value: unknown) => [`${value}`, "Dump Score"]}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={50}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
