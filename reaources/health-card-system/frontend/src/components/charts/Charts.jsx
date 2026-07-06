import {
  AreaChart as RechartsArea,
  Area,
  BarChart as RechartsBar,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#0E7C7B", "#C9A24B", "#E8553A", "#1565C0", "#6A1B9A", "#2E7D32", "#E65100"];

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-xl shadow-lg text-sm border ${isDark ? "bg-surface-dark-2 border-surface-dark-3" : "bg-white border-mist-light"}`}>
      {label && <p className="font-semibold text-[var(--text-primary)] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export function AreaChart({ data, dataKey, xKey = "name", color = "#0E7C7B", height = 220, gradient = true }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2D3B50" : "#E4E9ED";
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsArea data={data}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={gradient ? `url(#grad-${dataKey})` : "transparent"}
            dot={{ fill: color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color }}
          />
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiAreaChart({ data, series = [], xKey = "name", height = 220 }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2D3B50" : "#E4E9ED";
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsArea data={data}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`mgrad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              fill={`url(#mgrad-${s.key})`}
            />
          ))}
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, dataKey, xKey = "name", color = "#0E7C7B", height = 220, horizontal = false }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2D3B50" : "#E4E9ED";
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  if (horizontal) {
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBar data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
            <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]} />
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiBarChart({ data, series = [], xKey = "name", height = 220 }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2D3B50" : "#E4E9ED";
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({ data, nameKey = "name", valueKey = "value", height = 220, innerRadius = 55 }) {
  const { isDark } = useTheme();
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={innerRadius + 35}
            dataKey={valueKey}
            nameKey={nameKey}
            paddingAngle={3}
          >
            {(data || []).map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              background: isDark ? "#1A2332" : "#fff",
              border: isDark ? "1px solid #2D3B50" : "1px solid #E4E9ED",
              borderRadius: "12px",
              fontSize: "12px",
              color: isDark ? "#E8EDF2" : "#12243D",
            }}
          />
          <Legend
            formatter={(value) => <span style={{ color: textColor, fontSize: "11px" }}>{value}</span>}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({ data, dataKey, xKey = "name", color = "#0E7C7B", height = 220 }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? "#2D3B50" : "#E4E9ED";
  const textColor = isDark ? "#8B98A5" : "#8B98A5";
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }} />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}
