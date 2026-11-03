import { Activity, AlertCircle } from 'lucide-react';
import { CPCB_SUB_INDICES } from '../../data/mockData';

export default function RiskOverviewCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Environmental Risk Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Individual CPCB Sub-indices (Max sub-index defines composite AQI)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          6 Core Parameters
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
        {CPCB_SUB_INDICES.map((item) => (
          <div 
            key={item.pollutant} 
            className={`p-3 rounded-xl border border-slate-100 ${item.bg} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{item.pollutant}</span>
              <span className="text-[10px] text-slate-500 font-mono">{item.value} {item.unit}</span>
            </div>
            
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-slate-900">{item.subIndex}</span>
              <span className={`text-[10px] font-semibold ${item.color}`}>
                {item.band}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          <strong>Prominent Driver:</strong> Respirable Dust (PM10 sub-index 164) is currently dictating the overall AQI score.
        </span>
      </div>
    </div>
  );
}
