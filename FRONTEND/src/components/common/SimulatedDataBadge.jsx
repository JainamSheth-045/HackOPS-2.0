import { Info } from 'lucide-react';

export default function SimulatedDataBadge({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 shadow-sm ${className}`}
      title="All sensor readings on this interface are synthetic demonstration streams for hackathon evaluation and do not represent physical CPCB CAAQMS hardware."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      <span className="font-semibold tracking-wider">[SIMULATED DATA]</span>
      <Info className="w-3.5 h-3.5 text-amber-600 hidden sm:inline" />
    </div>
  );
}

