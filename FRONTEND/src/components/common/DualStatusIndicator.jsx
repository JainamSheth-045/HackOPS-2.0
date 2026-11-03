import { AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DualStatusIndicator({ statutory, aqi }) {
  const isCompliant = statutory.isCompliant;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Metric A: Statutory CPCB NAAQS Compliance */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`p-2.5 rounded-lg flex items-center justify-center ${isCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {isCompliant ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Statutory NAAQS Status (2009)
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${isCompliant ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {statutory.status}
              </span>
              {!isCompliant && (
                <span className="text-xs text-rose-600 font-medium">
                  {statutory.breachedPollutants?.join(', ')} exceeded 24h limit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-px h-10 bg-slate-200"></div>

        {/* Metric B: CPCB National AQI (2014) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              National Air Quality Index (AQI)
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-extrabold text-slate-800">
                {aqi.score}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {aqi.category}
              </span>
              <span className="text-xs text-slate-500">
                (Prominent: <strong className="text-slate-700">{aqi.prominentPollutant}</strong>)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Regulatory Context Banner */}
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="font-semibold text-slate-700">Regulatory Note:</span> Statutory limits carry legal enforcement under the Air Act (1981); AQI communicates public health risk.
        </div>
        <div className="text-slate-400">
          Ref: CPCB Gazette Notification B-29016/20/90/PCI-L
        </div>
      </div>
    </div>
  );
}

