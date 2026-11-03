import { 
  Wind, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import AirQualityChart from '../components/dashboard/AirQualityChart';
import RiskOverviewCard from '../components/dashboard/RiskOverviewCard';
import RecentIncidentsCard from '../components/dashboard/RecentIncidentsCard';
import StationStatusCard from '../components/dashboard/StationStatusCard';
import DualStatusIndicator from '../components/common/DualStatusIndicator';
import { CURRENT_TELEMETRY, HOURLY_TRENDS_24H } from '../data/mockData';

export default function DashboardPage() {
  const { pm25, pm10, aqi, statutoryCompliance } = CURRENT_TELEMETRY;

  return (
    <div className="space-y-6">
      {/* Top Banner: Dual Compliance & AQI Status Indicator */}
      <DualStatusIndicator 
        statutory={statutoryCompliance} 
        aqi={aqi} 
      />

      {/* Primary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: PM2.5 Average */}
        <MetricCard
          title="Average PM2.5"
          value={pm25.current}
          unit={pm25.unit}
          standard="60 µg/m³ 24h"
          utilization={pm25.utilizationPercent}
          status={pm25.status}
          icon={Wind}
          description="Fine Inhalable Particulates"
        />

        {/* Metric 2: PM10 Average */}
        <MetricCard
          title="Average PM10"
          value={pm10.current}
          unit={pm10.unit}
          standard="100 µg/m³ 24h"
          utilization={pm10.utilizationPercent}
          status={pm10.status}
          icon={Flame}
          description="Respirable Suspended Dust"
        />

        {/* Metric 3: Active Pollution Incidents */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden ring-1 ring-rose-500/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Active Incidents
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
                  2
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Breaches Open
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-rose-700 font-semibold">
              1 Critical • 1 Moderate
            </span>
            <Link
              to="/incidents"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Resolve &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Overall Air Quality Status */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden ring-1 ring-amber-500/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Air Quality Status
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {aqi.score}
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {aqi.category}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>CPCB Index (0-500)</span>
            <span className="font-semibold text-slate-700">Driver: {aqi.prominentPollutant}</span>
          </div>
        </div>
      </div>

      {/* Quick Action & Compliance CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Compliance Copilot Active</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Industrial Emission Non-Compliance Detected
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Station Alpha recorded PM10 rolling 24-hr average exceeding CPCB standards. Deploy immediate suppression protocols or file an incident report.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            to="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Incident</span>
          </Link>
          <Link
            to="/compliance"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100 font-semibold text-xs border border-emerald-700/50 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>View NAAQS Rules</span>
          </Link>
        </div>
      </div>

      {/* Main Visualizations & Trend Chart */}
      <AirQualityChart data={HOURLY_TRENDS_24H} />

      {/* Lower Multi-Column Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Environmental Risk & Sub-indices (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <RiskOverviewCard />
          <RecentIncidentsCard />
        </div>

        {/* Right Column: Station Monitoring Network */}
        <div className="space-y-6">
          <StationStatusCard />

          {/* Quick Regulatory Reference Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>CPCB Statutory Limits</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">2009 Standards</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              National Ambient Air Quality Standards (NAAQS) 24-Hour Limits for Industrial & Residential areas:
            </p>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-sans">PM2.5 (Fine Particulates)</span>
                <span className="font-bold text-slate-900">60 µg/m³</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-sans">PM10 (Respirable Dust)</span>
                <span className="font-bold text-slate-900">100 µg/m³</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-sans">SO2 (Sulphur Dioxide)</span>
                <span className="font-bold text-slate-900">80 µg/m³</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 font-sans">NO2 (Nitrogen Dioxide)</span>
                <span className="font-bold text-slate-900">80 µg/m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Advisory & Academic Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs text-center space-y-1">
        <div className="font-semibold text-slate-700">
          EcoSentinel AI Operational Demonstration
        </div>
        <div>
          Notice: Telemetry presented in this interface is synthetic simulated data for hackathon evaluation. Automated compliance assessments and Gemini AI recommendations provide operational decision support and do not constitute certified regulatory determinations under the Central or State Pollution Control Boards.
        </div>
      </div>
    </div>
  );
}

