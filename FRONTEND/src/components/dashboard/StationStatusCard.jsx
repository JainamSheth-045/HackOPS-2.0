import { Radio, MapPin } from 'lucide-react';
import { DEMO_STATIONS } from '../../data/mockData';

export default function StationStatusCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Monitoring Station Network
            </h3>
            <p className="text-xs text-slate-500">
              Regional CAAQMS & Industrial Estate telemetry nodes
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
          3 Stations Active
        </span>
      </div>

      <div className="space-y-2.5">
        {DEMO_STATIONS.map((station) => {
          const isBreach = station.statutoryStatus === 'BREACH';
          return (
            <div
              key={station.id}
              className="p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${station.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {station.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {station.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{station.cluster}, {station.state}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-extrabold text-slate-800">
                  AQI: {station.currentAQI}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${isBreach ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
