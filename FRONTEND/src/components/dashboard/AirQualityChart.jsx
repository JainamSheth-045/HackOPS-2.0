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
      <div className="bg-white text-[#202923] text-xs p-3.5 rounded-lg shadow-md border border-[#E6EBE7] space-y-1.5">
        <div className="font-semibold text-[#77827B] pb-1 border-b border-[#E6EBE7] flex items-center justify-between gap-4">
          <span>Hour: {label} hrs</span>
          <span className="text-[10px] text-[#174B35] font-mono">[SIMULATED]</span>
        </div>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs">
            <span style={{ color: item.color }} className="font-medium">
              {item.name}:
            </span>
            <span className="font-semibold text-[#202923]">
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
    <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-[#202923] tracking-tight">
            Particulate Concentration Trajectory (Last 24 Hours)
          </h2>
          <p className="text-xs text-[#77827B] mt-0.5">
            Hourly continuous readings vs CPCB NAAQS 24-hr statutory limits
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-[#174B35] rounded-full"></span>
            <span className="text-[#202923] font-medium">PM2.5 (Limit: 60)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-[#B91C1C] rounded-full"></span>
            <span className="text-[#202923] font-medium">PM10 (Limit: 100)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="minimalPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="minimalPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#174B35" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#174B35" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F1" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#77827B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#E6EBE7' }}
            />
            <YAxis 
              stroke="#77827B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#E6EBE7' }}
              domain={[0, 150]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Clean CPCB NAAQS 24-hr Statutory Reference Limits */}
            <ReferenceLine 
              y={60} 
              stroke="#174B35" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{ value: 'PM2.5 Limit (60)', position: 'insideTopRight', fill: '#174B35', fontSize: 10 }} 
            />
            <ReferenceLine 
              y={100} 
              stroke="#B91C1C" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{ value: 'PM10 Limit (100 - Breach)', position: 'insideTopRight', fill: '#B91C1C', fontSize: 10 }} 
            />

            <Area 
              type="monotone" 
              dataKey="pm10" 
              name="PM10" 
              stroke="#B91C1C" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#minimalPm10)" 
            />
            <Area 
              type="monotone" 
              dataKey="pm25" 
              name="PM2.5" 
              stroke="#174B35" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#minimalPm25)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
