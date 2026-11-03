import { useState } from 'react';
import { BrainCircuit, Sparkles, TrendingUp, Loader2, CheckCircle2, AlertTriangle, ShieldAlert, Wrench, RefreshCw } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PRESET_INCIDENTS = [
  {
    id: 'INC-2026-081',
    title: 'INC-2026-081: Respirable Dust Surge (PM10: 118.5 µg/m³)',
    pollutant: 'PM10',
    observedValue: '118.5 µg/m³',
    cluster: 'Station Alpha - Vapi GIDC Chemical Estate (Gujarat)',
    description: 'Continuous ambient PM10 exceedance reaching 118.5 µg/m³ against 24-hr CPCB NAAQS threshold of 100 µg/m³. Visible particulate haze in Sector 2 crushing line.'
  },
  {
    id: 'INC-2026-079',
    title: 'INC-2026-079: Acid Gas Plume (SO2: 94.2 µg/m³)',
    pollutant: 'SO2',
    observedValue: '94.2 µg/m³',
    cluster: 'Station Gamma - Tarapur MIDC Zone B (Maharashtra)',
    description: 'Sustained sulphur dioxide surge to 94.2 µg/m³ breaching 24-hr CPCB NAAQS limit (80 µg/m³). Sharp pungent odor reported near wet scrubber discharge stack.'
  },
  {
    id: 'INC-2026-074',
    title: 'INC-2026-074: Fine Combustion Smoke (PM2.5: 78.0 µg/m³)',
    pollutant: 'PM2.5',
    observedValue: '78.0 µg/m³',
    cluster: 'Station Beta - Manesar IMT Automotive Belt (Haryana)',
    description: 'Fine particulate smoke peaking at 78.0 µg/m³ against statutory limit of 60 µg/m³. Suspected uncontrolled diesel generator exhaust plume during grid outage.'
  },
  {
    id: 'INC-2026-00103',
    title: 'INC-2026-00103: Auxiliary Boiler Fire & Heavy Smoke',
    pollutant: 'Industrial Fire',
    observedValue: 'Thermal Ignition',
    cluster: 'Plant B-4, Tarapur MIDC Zone III',
    description: 'Auxiliary fuel oil boiler explosion and fire ignition with dense black carbon plume and heat radiation toward chemical storage bay.'
  },
  {
    id: 'INC-2026-00102',
    title: 'INC-2026-00102: Severe Urban Waterlogging (2.5 ft)',
    pollutant: 'Urban Inundation',
    observedValue: '2.5 feet depth',
    cluster: 'Varachha Main Ring Road, Surat',
    description: 'Severe stormwater runoff accumulation obstructing major arterial bus transit corridor following high-intensity monsoon rainfall.'
  }
];

export default function IntelligencePage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState(PRESET_INCIDENTS[0].id);
  const [customDescription, setCustomDescription] = useState(PRESET_INCIDENTS[0].description);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const selectedPreset = PRESET_INCIDENTS.find((i) => i.id === selectedIncidentId) || PRESET_INCIDENTS[0];

  const handleIncidentChange = (e) => {
    const id = e.target.value;
    setSelectedIncidentId(id);
    const preset = PRESET_INCIDENTS.find((i) => i.id === id);
    if (preset) {
      setCustomDescription(preset.description);
    }
  };

  // Rule-based client fallback engine when offline
  const runLocalRuleEngine = (preset, text) => {
    const combined = `${preset.pollutant} ${preset.title} ${text}`.toLowerCase();

    if (combined.includes('boiler') || combined.includes('fire') || combined.includes('explosion')) {
      return {
        category: 'Accidents & Emergencies',
        suggested_severity: 'Critical',
        risk_explanation: 'Acute industrial combustion emergency with heavy black carbon smoke. High risk of thermal propagation to adjacent chemical storage vessels.',
        likely_cause: 'Auxiliary fuel oil atomizing nozzle fouling and flameout, leading to fuel accumulation and flash ignition in economizer duct.',
        immediate_actions: [
          'Actuate Emergency Shutdown Valve (ESV-01) on fuel supply line.',
          'Evacuate downwind personnel within 300m perimeter to designated muster station.',
          'Notify Industrial MIDC Fire Station and District Disaster Control Room.'
        ],
        long_term_capa: [
          'Replace burner flame scanner assembly with fail-safe optical UV/IR sensor.',
          'Conduct non-destructive ultrasonic testing on all auxiliary boiler flue ducts.'
        ]
      };
    }

    if (combined.includes('waterlog') || combined.includes('flood') || combined.includes('inundation')) {
      return {
        category: 'Natural Disasters',
        suggested_severity: 'Moderate',
        risk_explanation: 'Urban waterlogging exceeding 2.5 feet obstructing transit corridors, risking storm drain overflow and localized contamination.',
        likely_cause: 'Silt deposition and uncollected solid waste clogging culvert inlet grates during sudden high-intensity precipitation.',
        immediate_actions: [
          'Deploy two 50 HP mobile diesel dewatering pumps to clear arterial roadway.',
          'Place warning barricades and divert heavy freight traffic to bypass link.'
        ],
        long_term_capa: [
          'Increase stormwater culvert cross-sectional flow capacity before next monsoon.',
          'Implement automated ultrasonic flood depth sensors connected to city dashboard.'
        ]
      };
    }

    if (combined.includes('so2') || combined.includes('sulphur')) {
      return {
        category: 'Environmental Pollution',
        suggested_severity: 'High',
        risk_explanation: 'SO2 reading exceeds the 24-hr CPCB NAAQS statutory limit of 80 µg/m³. Significant respiratory hazard for asthmatic individuals in adjacent residential zones.',
        likely_cause: 'Pressure drop across caustic soda circulation pump in wet flue gas desulphurization (FGD) scrubber.',
        immediate_actions: [
          'Switch over immediately to standby alkali scrubbing recirculation pump.',
          'Check caustic scrubbing liquor pH and dose 30% NaOH to maintain pH above 7.8.',
          'Reduce primary boiler load by 20% until stack analyzer shows SO2 < 70 µg/m³.'
        ],
        long_term_capa: [
          'Install redundant pH and differential pressure transmitters on primary scrubber tower.',
          'Recalibrate Continuous Emission Monitoring System (CEMS) gas analyzers.'
        ]
      };
    }

    if (combined.includes('pm2.5') || combined.includes('pm25')) {
      return {
        category: 'Environmental Pollution',
        suggested_severity: 'High',
        risk_explanation: 'Fine particulate concentration breaches CPCB 24-hr threshold (60 µg/m³). Deep pulmonary penetration poses elevated cardiovascular risk.',
        likely_cause: 'Heavy diesel generator exhaust running at suboptimal load during grid transition.',
        immediate_actions: [
          'Transfer electrical loads to primary grid supply and halt un-scrubbed DG sets.',
          'Deploy anti-smog misting cannon in raw material storage yard.'
        ],
        long_term_capa: [
          'Retrofit all diesel generating sets with particulate ceramic filter traps (RECD).',
          'Pave internal transport lanes with high-durability bituminous concrete.'
        ]
      };
    }

    // Default: PM10 breach
    return {
      category: 'Environmental Pollution',
      suggested_severity: 'High',
      risk_explanation: 'PM10 concentration breaches the mandatory CPCB NAAQS 24-hr limit of 100 µg/m³ under the Air (Prevention and Control of Pollution) Act 1981.',
      likely_cause: 'Differential pressure collapse in crushing sector baghouse indicating torn filtration fabric in compartment 3.',
      immediate_actions: [
        'Isolate damaged filter compartment 3 and route exhaust to secondary bag filter bank.',
        'Activate high-pressure boundary water misting system along cluster perimeter.',
        'Record statutory non-compliance in Form IV environmental registry.'
      ],
      long_term_capa: [
        'Replace torn needle-felt bags with heat-resistant PTFE-coated filter media.',
        'Install continuous optical broken-bag detection sensors on clean-gas exhaust.'
      ]
    };
  };

  const handleRunDiagnostics = async () => {
    setIsAnalyzing(true);
    setStatusMessage(null);

    const payload = {
      incident_type: selectedPreset.pollutant,
      pollutant: selectedPreset.pollutant,
      observed_value: selectedPreset.observedValue,
      cluster: selectedPreset.cluster,
      description: customDescription
    };

    try {
      const response = await fetch(`${API_BASE_URL}/diagnostics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.diagnostic) {
          setDiagnosticResult(data.diagnostic);
          setStatusMessage({ type: 'success', text: `Diagnostic completed via Backend Intelligence Engine for ${selectedPreset.id}` });
          return;
        }
      }
      throw new Error('Backend diagnostics returned non-200');
    } catch {
      // Graceful local rule-based heuristic execution
      const localResult = runLocalRuleEngine(selectedPreset, customDescription);
      setDiagnosticResult({
        analyzed_at: new Date().toISOString(),
        incident_type: selectedPreset.pollutant,
        pollutant: selectedPreset.pollutant,
        observed_value: selectedPreset.observedValue,
        cluster: selectedPreset.cluster,
        category: localResult.category,
        suggested_severity: localResult.suggested_severity,
        risk_explanation: localResult.risk_explanation,
        likely_cause: localResult.likely_cause,
        immediate_actions: localResult.immediate_actions,
        long_term_capa: localResult.long_term_capa,
        model: 'EcoSentinel Local Rule-Based Heuristic v2.4 (CPCB NAAQS Standards)',
        is_simulation: true
      });
      setStatusMessage({ type: 'success', text: `Diagnostic completed via Local Heuristic Rule Engine for ${selectedPreset.id}` });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#202923] tracking-tight">
            Environmental Intelligence & Anomaly Detection
          </h1>
          <p className="text-xs text-[#77827B] mt-1">
            Automated surge heuristics, predictive trajectory lookaheads, and AI-assisted root-cause diagnostics
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Internal Anomaly Detection Heuristic */}
        <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EAF1EB] text-[#174B35]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#202923]">
                Operational Surge Detection
              </h2>
              <span className="text-[10px] text-[#174B35] bg-[#EAF1EB] font-medium px-2 py-0.5 rounded border border-[#D5E2D8]">
                Internal Heuristic
              </span>
            </div>
          </div>
          <p className="text-xs text-[#77827B] leading-relaxed">
            Evaluates short-term rate-of-change (Delta C / Delta t). Triggers when instantaneous readings surge 40% or more within 15 minutes over baseline, providing early warnings before 24-hr statutory limits are breached.
          </p>
          <div className="p-3 bg-[#F7F9F7] rounded-lg border border-[#E6EBE7] text-xs font-mono text-[#174B35]">
            Trigger Condition: (C_instant - C_1h_baseline) / C_1h_baseline &ge; 0.40
          </div>
        </div>

        {/* Card 2: 24-Hour Trend Forecasting */}
        <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EAF1EB] text-[#174B35]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#202923]">
                Pollution Trend Lookahead
              </h2>
              <span className="text-[10px] text-[#174B35] bg-[#EAF1EB] font-medium px-2 py-0.5 rounded border border-[#D5E2D8]">
                6h & 24h Trajectory
              </span>
            </div>
          </div>
          <p className="text-xs text-[#77827B] leading-relaxed">
            Applies linear regression over recent operational hours to calculate estimated time-to-breach (T_breach), enabling plant supervisors to initiate proactive suppression before legal limits are crossed.
          </p>
          <div className="p-3 bg-[#F7F9F7] rounded-lg border border-[#E6EBE7] text-xs font-mono text-[#174B35]">
            T_breach = (NAAQS_Limit - C_current) / Hourly_Rate_of_Change
          </div>
        </div>
      </div>

      {/* AI Advisory Copilot Demonstration Block */}
      <div className="rounded-xl bg-white border border-[#E6EBE7] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6EBE7]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EAF1EB] text-[#174B35]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202923]">
                AI Incident Diagnostics & Root-Cause Analysis
              </h2>
              <p className="text-xs text-[#77827B]">
                Rule-based industrial diagnostics, statutory severity classification, and corrective action synthesis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunDiagnostics}
            disabled={isAnalyzing}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-xs shadow-xs transition-all shrink-0 ${
              isAnalyzing
                ? 'bg-[#174B35]/70 cursor-not-allowed'
                : 'bg-[#174B35] hover:bg-[#103B2B] cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Diagnostics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Diagnostics</span>
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-3 flex items-center gap-2 text-xs text-[#065F46]">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Incident Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="incidentSelector" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-1.5">
              Target Incident Scenario
            </label>
            <select
              id="incidentSelector"
              value={selectedIncidentId}
              onChange={handleIncidentChange}
              className="w-full text-xs rounded-lg border border-[#E6EBE7] p-2.5 bg-white text-[#202923] focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35]"
            >
              {PRESET_INCIDENTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-[#77827B] mt-1">
              Facility: <span className="font-medium text-[#202923]">{selectedPreset.cluster}</span>
            </div>
          </div>

          <div>
            <label htmlFor="customObs" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-1.5">
              Incident Observations & Field Logs
            </label>
            <textarea
              id="customObs"
              rows="2"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full text-xs rounded-lg border border-[#E6EBE7] p-2.5 bg-white text-[#202923] focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35]"
              placeholder="Enter observed symptoms, plume appearance, equipment telemetry..."
            />
          </div>
        </div>

        {/* Diagnostic Output Card */}
        {diagnosticResult ? (
          <div className="rounded-xl border border-[#A7F3D0] bg-[#F7FBF8] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E6EBE7]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
                <span className="text-xs font-bold text-[#065F46] uppercase tracking-wider">
                  Diagnostic Report ({selectedPreset.id})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#E6EBE7] text-[#202923]">
                  Domain: {diagnosticResult.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                    diagnosticResult.suggested_severity === 'Critical'
                      ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                      : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                  }`}
                >
                  Severity: {diagnosticResult.suggested_severity}
                </span>
              </div>
            </div>

            {/* Statutory Risk Explanation */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#202923] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span>Statutory Compliance & Health Risk Assessment</span>
              </div>
              <p className="text-xs text-[#77827B] leading-relaxed bg-white p-3 rounded-lg border border-[#E6EBE7]">
                {diagnosticResult.risk_explanation}
              </p>
            </div>

            {/* Root Cause Diagnosis */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#202923] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#B91C1C]" />
                <span>Diagnosed Technical Root Cause</span>
              </div>
              <p className="text-xs text-[#202923] font-medium bg-white p-3 rounded-lg border border-[#E6EBE7]">
                {diagnosticResult.likely_cause}
              </p>
            </div>

            {/* Immediate Mitigation & CAPA Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2 bg-white p-3.5 rounded-lg border border-[#E6EBE7]">
                <div className="text-xs font-semibold text-[#065F46] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Immediate Containment Actions</span>
                </div>
                <ul className="text-xs text-[#77827B] space-y-1 list-disc pl-4">
                  {diagnosticResult.immediate_actions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 bg-white p-3.5 rounded-lg border border-[#E6EBE7]">
                <div className="text-xs font-semibold text-[#174B35] flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#174B35]" />
                  <span>Corrective & Preventive Action (CAPA)</span>
                </div>
                <ul className="text-xs text-[#77827B] space-y-1 list-disc pl-4">
                  {diagnosticResult.long_term_capa.map((capa, idx) => (
                    <li key={idx}>{capa}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Simulation Disclaimer Label */}
            <div className="pt-2 border-t border-[#E6EBE7] flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#77827B]">
              <span className="font-mono text-[10px] text-[#77827B]">Engine: {diagnosticResult.model || 'EcoSentinel Heuristic Copilot'}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[10px]">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                AI-Assisted Simulation (Rule-based diagnostic model, not verified official regulatory clearance)
              </span>
            </div>
          </div>
        ) : (
          /* Initial Default View before clicking Run Diagnostics */
          <div className="bg-[#F7F9F7] rounded-lg p-5 border border-[#E6EBE7] text-xs text-[#202923] space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[#174B35] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#174B35]"></span>
                Baseline Standby Diagnosis: #{selectedPreset.id} ({selectedPreset.pollutant})
              </div>
              <span className="text-[10px] text-[#77827B] bg-white px-2 py-0.5 rounded border border-[#E6EBE7]">
                Click 'Run Diagnostics' to evaluate
              </span>
            </div>
            <p className="text-xs text-[#77827B]">
              Click the <strong className="text-[#174B35]">Run Diagnostics</strong> button above to execute automated rule-based statutory analysis across CPCB NAAQS limits, equipment failure heuristics, and corrective action checklists.
            </p>
          </div>
        )}

        <div className="text-[11px] text-[#77827B] italic">
          * Advisory Disclaimer: All AI recommendations provide technical guidance and operational decision support. They do not constitute official statutory decisions or certified regulatory clearance.
        </div>
      </div>
    </div>
  );
}
