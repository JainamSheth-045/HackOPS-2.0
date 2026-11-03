import { Activity, AlertCircle } from 'lucide-react';
import { CPCB_SUB_INDICES } from '../../data/mockData';

export default function RiskOverviewCard() {
  return (
    <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EAF1EB] text-[#174B35]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202923]">
              Environmental Risk Breakdown
            </h3>
            <p className="text-xs text-[#77827B]">
              Individual CPCB Sub-indices (Max sub-index dictates composite AQI)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#174B35] bg-[#EAF1EB] px-2.5 py-1 rounded-full border border-[#D5E2D8]">
          6 Parameters
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {CPCB_SUB_INDICES.map((item) => (
          <div
            key={item.pollutant}
            className="p-3.5 rounded-lg border border-[#E6EBE7] bg-[#F7F9F7] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#202923]">{item.pollutant}</span>
              <span className="text-[11px] text-[#77827B] font-mono">{item.value} {item.unit}</span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#202923] font-mono">{item.subIndex}</span>
              <span className="text-[10px] font-semibold text-[#174B35] uppercase tracking-wide">
                {item.band.replace(' (Prominent)', '')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E6EBE7] text-xs text-[#77827B] flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
        <span>
          <strong className="text-[#202923]">Prominent Driver:</strong> Respirable Dust (PM10 sub-index 164) is currently dictating the overall AQI score.
        </span>
      </div>
    </div>
  );
}
