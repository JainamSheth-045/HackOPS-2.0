import { AlertOctagon, CheckCircle2, ShieldAlert, Scale } from 'lucide-react';

export default function DualStatusIndicator({ statutory, aqi }) {
  const isCompliant = statutory.isCompliant;

  return (
    <div className="bg-white rounded-xl border border-[#E6EBE7] p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        {/* Metric A: Statutory CPCB NAAQS Compliance (Air Act 1981) */}
        <div className="flex-1 flex items-start sm:items-center gap-4 p-3.5 rounded-lg bg-[#F7F9F7] border border-[#E6EBE7]">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isCompliant 
              ? 'bg-[#EAF1EB] text-[#174B35]' 
              : 'bg-[#FEE2E2] text-[#B91C1C]'
          }`}>
            {isCompliant ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#77827B] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#174B35]" />
                Statutory CPCB NAAQS Status
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#77827B] border border-[#E6EBE7] font-mono">
                2009 Standards
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                isCompliant 
                  ? 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]' 
                  : 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
              }`}>
                {statutory.status}
              </span>
              {!isCompliant && (
                <span className="text-xs text-[#B91C1C] font-medium">
                  {statutory.breachedPollutants?.join(', ')} exceeds 24h statutory limit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Divider */}
        <div className="hidden lg:block w-px h-12 bg-[#E6EBE7]" />

        {/* Metric B: CPCB National AQI (Public Health Communication) */}
        <div className="flex-1 flex items-start sm:items-center gap-4 p-3.5 rounded-lg bg-[#F7F9F7] border border-[#E6EBE7]">
          <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] shrink-0 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#77827B]">
                National Air Quality Index (AQI)
              </span>
              <span className="text-[11px] text-[#77827B]">
                Scale 0–500
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              <span className="text-xl font-bold text-[#202923] tracking-tight">
                {aqi.score}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                {aqi.category}
              </span>
              <span className="text-xs text-[#77827B]">
                (Prominent Pollutant: <strong className="text-[#202923] font-semibold">{aqi.prominentPollutant}</strong>)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Context Notice */}
      <div className="mt-4 pt-3 border-t border-[#E6EBE7] flex items-center justify-between flex-wrap gap-2 text-xs text-[#77827B]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#174B35]" />
          <span className="text-[#202923] font-medium">Regulatory Distinction:</span>
          <span>NAAQS enforces legal thresholds under the Air Act (1981); AQI provides public health guidance.</span>
        </div>
        <div className="text-[11px] text-[#77827B]">
          CPCB Notification B-29016/20/90/PCI-L
        </div>
      </div>
    </div>
  );
}
