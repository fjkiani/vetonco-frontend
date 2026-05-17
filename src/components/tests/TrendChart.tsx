import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDate } from "../../lib/utils";

interface DataPoint {
  date: string;
  [key: string]: number | string | null;
}

interface TrendSeries {
  key: string;
  label: string;
  color: string;
  threshold?: number;
  thresholdLabel?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  series: TrendSeries[];
  title?: string;
  yLabel?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TrendChart({ data, series, title, yLabel }: TrendChartProps) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400 bg-gray-50 rounded-lg">
        Need at least 2 data points to show trend
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    _date: formatDate(d.date as string | number),
  }));

  return (
    <div>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="_date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#9ca3af" } } : undefined}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: s.color ?? COLORS[i % COLORS.length] }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
          {series
            .filter((s) => s.threshold != null)
            .map((s) => (
              <ReferenceLine
                key={`ref-${s.key}`}
                y={s.threshold}
                stroke={s.color}
                strokeDasharray="4 4"
                label={{ value: s.thresholdLabel ?? `${s.label} threshold`, fontSize: 10, fill: s.color }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
