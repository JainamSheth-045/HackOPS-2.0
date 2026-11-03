import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
        <div className="font-bold text-slate-300 pb-1 border-b border-slate-800">
          Timestamp: {label} hrs
        </div>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span style={{ color: item.color }} className="font-semibold">
              {item.name}:
            </span>
            <span className="font-mono font-bold">
              {item.value} µg/m³
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AirQualityChart({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Particulate Matter Trend (Last 24 Hours)
          </h2>
          <p className="text-xs text-slate-500">
            Hourly continuous concentration trajectory with CPCB 24-hr statutory limits
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-teal-500 rounded"></span>
            <span className="text-slate-600 font-medium">PM2.5 (Limit: 60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded"></span>
            <span className="text-slate-600 font-medium">PM10 (Limit: 100)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              domain={[0, 150]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* CPCB NAAQS 24-hr Statutory Reference Limits */}
            <ReferenceLine 
              y={60} 
              stroke="#0d9488" 
              strokeDasharray="4 4" 
              label={{ value: 'PM2.5 Standard (60)', position: 'insideTopRight', fill: '#0d9488', fontSize: 10 }} 
            />
            <ReferenceLine 
              y={100} 
              stroke="#e11d48" 
              strokeDasharray="4 4" 
              label={{ value: 'PM10 Standard (100)', position: 'insideTopRight', fill: '#e11d48', fontSize: 10 }} 
            />

            <Area 
              type="monotone" 
              dataKey="pm10" 
              name="PM10" 
              stroke="#e11d48" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPm10)" 
            />
            <Area 
              type="monotone" 
              dataKey="pm25" 
              name="PM2.5" 
              stroke="#0d9488" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPm25)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
