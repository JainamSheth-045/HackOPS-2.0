import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RECENT_INCIDENTS } from '../../data/mockData';

export default function RecentIncidentsCard() {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';
      case 'MODERATE':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      default:
        return 'bg-[#F7F9F7] text-[#77827B] border-[#E6EBE7]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';
      case 'IN_PROGRESS':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'MITIGATED':
        return 'bg-[#EAF1EB] text-[#174B35] border-[#D5E2D8]';
      default:
        return 'bg-[#F7F9F7] text-[#77827B] border-[#E6EBE7]';
    }
  };

  return (
    <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FEE2E2] text-[#B91C1C]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#202923]">
              Active Non-Compliance Incidents
            </h3>
            <p className="text-xs text-[#77827B]">
              Live statutory breaches & operational exceedances
            </p>
          </div>
        </div>

        <Link
          to="/incidents"
          className="text-xs font-semibold text-[#174B35] hover:text-[#103B2B] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {RECENT_INCIDENTS.map((inc) => (
          <div 
            key={inc.id}
            className="p-3.5 rounded-lg border border-[#E6EBE7] bg-[#F7F9F7] hover:bg-white hover:border-[#D5E2D8] transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#202923]">{inc.id}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(inc.severity)}`}>
                  {inc.severity}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getStatusBadge(inc.status)}`}>
                  {inc.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#77827B]">
                <Clock className="w-3 h-3 text-[#77827B]" />
                <span>{inc.detectedAt}</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between text-xs">
              <span className="font-semibold text-[#202923]">
                {inc.pollutant}: <span className="text-[#B91C1C] font-bold">{inc.value}</span>
              </span>
              <span className="text-[11px] text-[#77827B]">
                Standard: {inc.standard}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-[#77827B] line-clamp-1">
              {inc.causeSummary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
