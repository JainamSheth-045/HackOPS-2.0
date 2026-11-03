import { Radio, MapPin } from 'lucide-react';
import { DEMO_STATIONS } from '../../data/mockData';

export default function StationStatusCard() {
  return (
    <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#EAF1EB] text-[#174B35]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202923]">
              Monitoring Station Network
            </h3>
            <p className="text-xs text-[#77827B]">
              Regional CAAQMS telemetry stations
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#174B35] bg-[#EAF1EB] px-2.5 py-1 rounded-full border border-[#D5E2D8]">
          3 Nodes Active
        </span>
      </div>

      <div className="space-y-3">
        {DEMO_STATIONS.map((station) => {
          const isBreach = station.statutoryStatus === 'BREACH';
          return (
            <div
              key={station.id}
              className="p-3.5 rounded-lg border border-[#E6EBE7] bg-[#F7F9F7] flex items-center justify-between gap-3 hover:bg-white hover:border-[#D5E2D8] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  station.status === 'ACTIVE' 
                    ? 'bg-[#174B35]' 
                    : 'bg-[#D97706]'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202923]">
                      {station.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#77827B]">
                      {station.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#77827B] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#174B35]" />
                    <span>{station.cluster}, {station.state}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#202923] font-mono">
                  AQI: {station.currentAQI}
                </div>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${
                    isBreach 
                      ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]' 
                      : 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]'
                  }`}>
                    {station.statutoryStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
