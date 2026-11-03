import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RECENT_INCIDENTS } from '../../data/mockData';

export default function RecentIncidentsCard() {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MITIGATED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Pollution Incidents
            </h3>
            <p className="text-xs text-slate-500">
              Active statutory breaches & operational exceedance tickets
            </p>
          </div>
        </div>

        <Link
          to="/incidents"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {RECENT_INCIDENTS.map((inc) => (
          <div 
            key={inc.id}
            className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{inc.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(inc.severity)}`}>
                  {inc.severity}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(inc.status)}`}>
                  {inc.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{inc.detectedAt}</span>
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between text-xs">
              <span className="font-bold text-slate-800">
                {inc.pollutant}: <span className="text-rose-600">{inc.value}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Standard: {inc.standard}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
              {inc.causeSummary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

