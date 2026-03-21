import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function UptimeChart({ machineId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:5000/api/logs/${machineId}`);
      const data = await res.json();

      const formatted = data.reverse().map((log) => ({
        time: log.recorded_at.slice(11, 16),
        uptime: log.uptime,
      }));

      setLogs(formatted);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [machineId]); // re-run when machineId changes

  if (logs.length === 0) return <p>No data yet...</p>;

  return (
    <div>
      <h2>Uptime History</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={logs}>
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#2d3148" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            unit="%"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1d2e",
              border: "1px solid #2d3148",
              borderRadius: "6px",
              color: "#e2e8f0",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#64748b", marginBottom: "4px" }}
            formatter={(value) => [`${value}%`, "Uptime"]}
          />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
