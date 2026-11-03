import { BrainCircuit, Sparkles, TrendingUp } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Environmental Intelligence & Anomaly Detection
          </h1>
          <p className="text-xs text-slate-500">
            Automated surge heuristics, predictive trajectory lookaheads, and Gemini AI root-cause analysis
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Internal Anomaly Detection Heuristic */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Operational Surge Detection
              </h2>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-semibold px-2 py-0.5 rounded">
                Internal Demo Heuristic
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluates short-term rate-of-change (Delta C / Delta t). Triggers when instantaneous readings surge 40% or more within 15 minutes over baseline, providing early warnings before 24-hr statutory limits are breached.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
            Trigger Condition: (C_instant - C_1h_baseline) / C_1h_baseline &ge; 0.40
          </div>
        </div>

        {/* Card 2: 24-Hour Trend Forecasting */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pollution Trend Lookahead
              </h2>
              <span className="text-[10px] text-teal-700 bg-teal-50 font-semibold px-2 py-0.5 rounded">
                6h & 24h Trajectory
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Applies linear regression over recent operational hours to calculate estimated time-to-breach (T_breach), enabling plant supervisors to initiate proactive suppression before legal limits are crossed.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-600">
            T_breach = (NAAQS_Limit - C_current) / Hourly_Rate_of_Change
          </div>
        </div>
      </div>

      {/* AI Advisory Copilot Demonstration Block */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4 ring-1 ring-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Gemini AI Compliance Copilot (Advisory Mode)
              </h2>
              <p className="text-xs text-slate-500">
                Context-aware root cause analysis & corrective action checklists
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Run Copilot Diagnostics
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="font-semibold text-slate-800">
            Active Diagnosis for Incident #INC-2026-081 (PM10 Exceedance):
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Likely Industrial Cause:</strong> Baghouse differential pressure drop below 50 mmWC indicating filter cloth tear in crushing sector.</li>
            <li><strong>Immediate Mitigation:</strong> Isolate compartment 3, activate auxiliary dust collector, and initiate raw material water misting.</li>
            <li><strong>Long-term CAPA:</strong> Replace damaged needle-felt bags and calibrate continuous pressure transmitter.</li>
          </ul>
        </div>

        <div className="text-[11px] text-slate-400 italic">
          * Advisory Disclaimer: All AI recommendations provide technical guidance and operational decision support. They do not constitute official statutory decisions or certified regulatory clearance.
        </div>
      </div>
    </div>
  );
}
