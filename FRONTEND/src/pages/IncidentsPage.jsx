import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { RECENT_INCIDENTS } from '../data/mockData';

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pollution Incident Management & CAPA
          </h1>
          <p className="text-xs text-slate-500">
            Lifecycle tracking of statutory breaches, root cause investigations, and corrective actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SimulatedDataBadge />
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Station & Cluster</th>
                <th className="p-3.5">Pollutant Exceedance</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Root Cause Summary</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_INCIDENTS.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{inc.id}</td>
                  <td className="p-3.5 text-slate-700">{inc.location}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{inc.pollutant}: {inc.value}</div>
                    <div className="text-[10px] text-slate-400">Limit: {inc.standard}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${inc.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs truncate">
                    {inc.causeSummary}
                  </td>
                  <td className="p-3.5 text-right">
                    <button 
                      type="button" 
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      CAPA Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
