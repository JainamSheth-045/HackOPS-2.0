import { 
  Wind, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  Sparkles,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import AirQualityChart from '../components/dashboard/AirQualityChart';
import RiskOverviewCard from '../components/dashboard/RiskOverviewCard';
import RecentIncidentsCard from '../components/dashboard/RecentIncidentsCard';
import StationStatusCard from '../components/dashboard/StationStatusCard';
import WorldPollutionMap from '../components/dashboard/WorldPollutionMap';
import DualStatusIndicator from '../components/common/DualStatusIndicator';
import { CURRENT_TELEMETRY, HOURLY_TRENDS_24H } from '../data/mockData';

export default function DashboardPage() {
  const { pm25, pm10, aqi, statutoryCompliance } = CURRENT_TELEMETRY;

  return (
    <div className="space-y-6">
      {/* Top Banner: Dual Statutory NAAQS vs CPCB AQI Status */}
      <DualStatusIndicator 
        statutory={statutoryCompliance} 
        aqi={aqi} 
      />

      {/* Primary KPI Metric Cards Grid */}
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
        <div className="rounded-xl bg-white border border-[#FECACA] p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#77827B] uppercase block">
                Active Incidents
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#B91C1C] tracking-tight">
                  2
                </span>
                <span className="text-xs font-medium text-[#77827B]">
                  Breaches Open
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FEE2E2] text-[#B91C1C]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6EBE7] flex items-center justify-between text-xs">
            <span className="text-[#B91C1C] font-semibold">
              1 Critical • 1 Moderate
            </span>
            <Link
              to="/incidents"
              className="font-semibold text-[#174B35] hover:text-[#103B2B]"
            >
              Resolve &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Overall Air Quality Status */}
        <div className="rounded-xl bg-white border border-[#FDE68A] p-5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#77827B] uppercase block">
                Air Quality Status
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#202923] tracking-tight">
                  {aqi.score}
                </span>
                <span className="text-xs font-semibold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                  {aqi.category}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FEF3C7] text-[#92400E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6EBE7] flex items-center justify-between text-xs text-[#77827B]">
            <span>CPCB Scale (0–500)</span>
            <span className="font-semibold text-[#202923]">Driver: {aqi.prominentPollutant}</span>
          </div>
        </div>
      </div>

      {/* Global Environmental Monitoring Network Map */}
      <WorldPollutionMap />

      {/* Forest Green Callout & Action Banner */}
      <div className="rounded-xl bg-[#174B35] text-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-[#103B2B]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#EAF1EB] text-[11px] font-medium border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#A8BFAE]" />
            <span>AI Compliance Copilot Active</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Industrial Emission Non-Compliance Detected
          </h2>
          <p className="text-xs sm:text-sm text-[#EAF1EB]/90 leading-relaxed font-sans">
            Station Alpha recorded PM10 rolling 24-hr average exceeding CPCB standards. Deploy immediate suppression protocols or file an incident report.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            to="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#F7F9F7] text-[#174B35] font-semibold text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#174B35]" />
            <span>Report Incident</span>
          </Link>
          <Link
            to="/compliance"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/20 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#A8BFAE]" />
            <span>NAAQS Rules</span>
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

          {/* Clean CPCB Statutory Reference Card */}
          <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-[#202923] text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#174B35]" />
                CPCB Statutory Limits
              </span>
              <span className="text-[10px] text-[#174B35] bg-[#EAF1EB] px-2 py-0.5 rounded border border-[#D5E2D8] font-mono">
                2009 Standards
              </span>
            </h3>
            <p className="text-[#77827B] text-xs">
              National Ambient Air Quality Standards (NAAQS) 24-Hour Limits for Industrial & Residential areas:
            </p>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between py-1.5 border-b border-[#E6EBE7]">
                <span className="text-[#202923]">PM2.5 (Fine Particulates)</span>
                <span className="font-bold text-[#174B35]">60 µg/m³</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6EBE7]">
                <span className="text-[#202923]">PM10 (Respirable Dust)</span>
                <span className="font-bold text-[#B91C1C]">100 µg/m³</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E6EBE7]">
                <span className="text-[#202923]">SO2 (Sulphur Dioxide)</span>
                <span className="font-bold text-[#174B35]">80 µg/m³</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#202923]">NO2 (Nitrogen Dioxide)</span>
                <span className="font-bold text-[#174B35]">80 µg/m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Advisory & Academic Disclaimer */}
      <div className="p-4 rounded-xl bg-white border border-[#E6EBE7] text-[#77827B] text-xs text-center space-y-1 shadow-xs">
        <div className="font-semibold text-[#202923]">
          EcoSentinel AI Operational Demonstration
        </div>
        <div className="text-[11px] leading-relaxed max-w-4xl mx-auto">
          Notice: Telemetry presented in this interface is synthetic simulated data for hackathon evaluation. Automated compliance assessments and Gemini AI recommendations provide operational decision support and do not constitute certified regulatory determinations under the Central or State Pollution Control Boards.
        </div>
      </div>
    </div>
  );
}
