import { Info } from 'lucide-react';

export default function SimulatedDataBadge({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#EAF1EB] text-[#174B35] border border-[#D5E2D8] ${className}`}
      title="All sensor readings on this interface are synthetic demonstration streams for hackathon evaluation and do not represent physical CPCB CAAQMS hardware."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#174B35]/70"></span>
      <span className="tracking-wider text-[11px] font-semibold uppercase">[SIMULATED DATA]</span>
      <Info className="w-3.5 h-3.5 text-[#174B35]/60 hidden sm:inline" />
    </div>
  );
}
