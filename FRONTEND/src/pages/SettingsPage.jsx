import { Shield, Sliders } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            System & Station Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure CPCB alert thresholds, notification contacts, and data simulation parameters
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="space-y-4">
        {/* Section 1: Telemetry Simulation Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Environmental Simulator Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Controls synthetic sensor stream generation for live demonstration and testing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Active Scenario</label>
              <select className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-xs">
                <option>Scenario 1: Industrial PM10 Dust Surge (Active Breach)</option>
                <option>Scenario 2: Night-time SO2 Flue Gas Acid Plume</option>
                <option>Scenario 3: Normal Baseline Compliance</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Simulation Stream Frequency</label>
              <select className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-xs">
                <option>Every 30 seconds (Live Demo Mode)</option>
                <option>Every 1 minute</option>
                <option>On-demand manual trigger</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Standards Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Regulatory Standards Schedule Profile
            </h2>
          </div>
          <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="font-bold text-slate-800">CPCB NAAQS Gazette Notification 2009</div>
              <div className="text-[11px] text-slate-500">Industrial, Residential, Rural and other Areas Schedule</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Enforced Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
