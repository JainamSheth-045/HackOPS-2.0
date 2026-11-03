import { Shield, Sliders } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#202923] tracking-tight">
            System & Station Settings
          </h1>
          <p className="text-xs text-[#77827B] mt-1">
            Configure CPCB alert thresholds, notification contacts, and data simulation parameters
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="space-y-4">
        {/* Section 1: Telemetry Simulation Configuration */}
        <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#174B35]" />
            <h2 className="text-sm font-bold text-[#202923]">
              Environmental Simulator Configuration
            </h2>
          </div>
          <p className="text-xs text-[#77827B]">
            Controls synthetic sensor stream generation for live demonstration and testing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block font-semibold text-[#202923] mb-1.5 uppercase text-[11px] tracking-wider">
                Active Scenario
              </label>
              <select className="w-full rounded-lg border border-[#E6EBE7] p-2.5 bg-white text-[#202923] text-xs focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35]">
                <option>Scenario 1: Industrial PM10 Dust Surge (Active Breach)</option>
                <option>Scenario 2: Night-time SO2 Flue Gas Acid Plume</option>
                <option>Scenario 3: Normal Baseline Compliance</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202923] mb-1.5 uppercase text-[11px] tracking-wider">
                Simulation Stream Frequency
              </label>
              <select className="w-full rounded-lg border border-[#E6EBE7] p-2.5 bg-white text-[#202923] text-xs focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35]">
                <option>Every 30 seconds (Live Demo Mode)</option>
                <option>Every 1 minute</option>
                <option>On-demand manual trigger</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Standards Profile */}
        <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#174B35]" />
            <h2 className="text-sm font-bold text-[#202923]">
              Regulatory Standards Schedule Profile
            </h2>
          </div>
          <div className="flex items-center justify-between text-xs p-4 bg-[#F7F9F7] rounded-lg border border-[#E6EBE7]">
            <div>
              <div className="font-bold text-[#202923]">CPCB NAAQS Gazette Notification 2009</div>
              <div className="text-[11px] text-[#77827B] mt-0.5">Industrial, Residential, Rural and other Areas Schedule</div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAF1EB] text-[#174B35] border border-[#D5E2D8] uppercase tracking-wider">
              Enforced Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
