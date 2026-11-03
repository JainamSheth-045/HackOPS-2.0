import { Send } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function ReportPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Report Pollution Incident
          </h1>
          <p className="text-xs text-slate-500">
            Log an industrial emission exceedance, black smoke plume, or equipment failure
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Monitoring Station / Cluster
            </label>
            <select className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white">
              <option>Station Alpha - Vapi GIDC Chemical Estate (Gujarat)</option>
              <option>Station Beta - Manesar IMT Automotive Belt (Haryana)</option>
              <option>Station Gamma - Tarapur MIDC Zone B (Maharashtra)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Observed Pollutant
            </label>
            <select className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white">
              <option>PM10 (Respirable Particulate Dust)</option>
              <option>PM2.5 (Fine Combustion Smoke)</option>
              <option>SO2 (Sulphur Dioxide Gas)</option>
              <option>NO2 (Nitrogen Dioxide / Acid Plume)</option>
              <option>CO (Carbon Monoxide Leaks)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Estimated Severity
            </label>
            <select className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white">
              <option>Moderate - Sustained elevated levels</option>
              <option>High - Statutory CPCB threshold breached</option>
              <option>Critical - Acute hazardous emission event</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Suspected Industrial Source
            </label>
            <input
              type="text"
              placeholder="e.g. Boiler Flue, Scrubber Pump, DG Set"
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Incident Description & Physical Observations
          </label>
          <textarea
            rows="4"
            placeholder="Describe visible emissions, odor, wind direction, or process malfunctions..."
            className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            * Incident will be logged to Supabase and trigger AI root-cause analysis
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Incident Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
