import { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  ShieldAlert, 
  Wrench, 
  AlertTriangle, 
  Info, 
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LOCATIONS = [
  { id: '03000000-0000-0000-0000-000000000001', label: 'Station Alpha - Vapi GIDC Chemical Estate (Gujarat)' },
  { id: '03000000-0000-0000-0000-000000000002', label: 'Station Beta - Manesar IMT Automotive Belt (Haryana)' },
  { id: '03000000-0000-0000-0000-000000000003', label: 'Station Gamma - Tarapur MIDC Zone B (Maharashtra)' },
  { id: '03000000-0000-0000-0000-000000000004', label: 'Surat Ring Road Transit Corridor (Gujarat)' }
];

const CATEGORIES = [
  { id: 'c1000000-0000-0000-0000-000000000001', label: 'Environmental Pollution (Air, Water, Toxic Leaks)' },
  { id: 'c1000000-0000-0000-0000-000000000002', label: 'Natural Disasters (Floods, Cyclones, Heatwaves)' },
  { id: 'c1000000-0000-0000-0000-000000000003', label: 'Accidents & Emergencies (Fires, Boiler Explosions)' },
  { id: 'c1000000-0000-0000-0000-000000000004', label: 'Public Infrastructure (Drainage Breaches, Sinkholes)' }
];

const POLLUTANTS = [
  'PM10 (Respirable Particulate Dust)',
  'PM2.5 (Fine Combustion Smoke)',
  'SO2 (Sulphur Dioxide Gas)',
  'NO2 (Nitrogen Dioxide / Acid Plume)',
  'CO (Carbon Monoxide Leaks)',
  'Chemical Effluent Discharge',
  'Industrial Smoke Plume',
  'Infrastructure Breakdown'
];

const SEVERITIES = [
  { value: 'Moderate', label: 'Moderate - Sustained elevated levels' },
  { value: 'High', label: 'High - Statutory CPCB threshold breached' },
  { value: 'Critical', label: 'Critical - Acute hazardous emission event' },
  { value: 'Low', label: 'Low - Localized or minor observation' }
];

// Helper to map category names to UUIDs
const mapCategoryToId = (categoryName) => {
  if (!categoryName) return CATEGORIES[0].id;
  const lower = categoryName.toLowerCase();
  if (lower.includes('disaster') || lower.includes('flood') || lower.includes('waterlog')) {
    return 'c1000000-0000-0000-0000-000000000002';
  }
  if (lower.includes('accident') || lower.includes('emergency') || lower.includes('fire') || lower.includes('boiler')) {
    return 'c1000000-0000-0000-0000-000000000003';
  }
  if (lower.includes('infrastructure') || lower.includes('drain') || lower.includes('sinkhole')) {
    return 'c1000000-0000-0000-0000-000000000004';
  }
  return 'c1000000-0000-0000-0000-000000000001';
};

// Client-side rule-based fallback engine (transparent simulation)
const runLocalDiagnosticFallback = (incidentType, pollutant, description, suspectedSource) => {
  const combined = `${incidentType} ${pollutant} ${description} ${suspectedSource}`.toLowerCase();

  if (combined.includes('boiler') || combined.includes('fire') || combined.includes('explosion') || combined.includes('smoke plume') || combined.includes('burn')) {
    return {
      category: 'Accidents & Emergencies',
      predicted_category: 'Accidents & Emergencies',
      suggested_severity: 'Critical',
      severity_color: '#DC2626',
      confidence_level: '96% (Simulated AI Analysis)',
      probable_root_cause: 'Auxiliary fuel oil atomizing nozzle blockage resulting in incomplete combustion, fuel accumulation, and secondary flash ignition in economizer duct.',
      environmental_and_health_risks: 'High-temperature industrial combustion failure with dense black particulate smoke plume. Extreme risk of thermal escalation, carbon monoxide flashover, and adjacent storage unit ignition.',
      recommended_corrective_actions: [
        'Actuate Emergency Fuel Shutoff Valve (ESV-01) on main supply header.',
        'Initiate controlled plant area evacuation per EHS SOP-12.',
        'Alert local Fire & Emergency Services and GIDC Disaster Dispatch.'
      ],
      recommended_preventive_actions: [
        'Perform hydrostatic pressure testing and casing thickness scans on boiler shell before re-commissioning.',
        'Overhaul burner flame scanner and replace with fail-safe optical UV/IR sensor.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('chemical') || combined.includes('effluent') || combined.includes('discharge') || combined.includes('leak') || combined.includes('spill') || combined.includes('acid plume')) {
    return {
      category: 'Environmental Pollution',
      predicted_category: 'Environmental Pollution',
      suggested_severity: 'Critical',
      severity_color: '#DC2626',
      confidence_level: '95% (Simulated AI Analysis)',
      probable_root_cause: 'Gasket degradation on primary aeration tank discharge manifold or untreated effluent bypass pump seal failure during peak batch wash.',
      environmental_and_health_risks: 'Untreated chemical effluent breach with high Chemical Oxygen Demand (COD) and dissolved heavy metals. Severe risk of acute aquatic toxicity, surface runoff contamination, and groundwater infiltration.',
      recommended_corrective_actions: [
        'Close effluent emergency isolation gate (EIG-02) and divert flow to equalisation holding pond.',
        'Deploy absorbent containment booms and neutralized calcium hydroxide slurry along perimeter drainage.',
        'Notify State Pollution Control Board (SPCB) Regional Officer per Water Act Section 32.'
      ],
      recommended_preventive_actions: [
        'Install automated online Total Organic Carbon (TOC) and turbidity trip-interlock at final discharge sump.',
        'Upgrade all mechanical pump seals to double cartridge seals with continuous barrier fluid monitoring.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('waterlog') || combined.includes('flood') || combined.includes('drain') || combined.includes('culvert') || combined.includes('inundation')) {
    return {
      category: 'Natural Disasters',
      predicted_category: 'Natural Disasters',
      suggested_severity: 'Moderate',
      severity_color: '#D97706',
      confidence_level: '91% (Simulated AI Analysis)',
      probable_root_cause: 'Silt accumulation and uncollected industrial solid debris at culvert inlet grates during high-intensity precipitation event.',
      environmental_and_health_risks: 'Stormwater accumulation exceeding 2.5 feet obstructing transit corridors, risking industrial effluent backflow into civic channels and shallow aquifer biological contamination.',
      recommended_corrective_actions: [
        'Deploy 50 HP tractor-mounted high-flow dewatering pump to discharge into secondary retention canal.',
        'Erect warning barriers and reroute light motor vehicles away from low-lying culvert.',
        'Clear floating plastic and manual grates using municipal vacuum suction truck.'
      ],
      recommended_preventive_actions: [
        'Re-engineer stormwater invert gradient and install mechanized trash bar screens at outfalls.',
        'Deploy continuous ultrasonic liquid level transmitters linked to SCADA alert system.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('so2') || combined.includes('sulphur')) {
    return {
      category: 'Environmental Pollution',
      predicted_category: 'Environmental Pollution',
      suggested_severity: 'High',
      severity_color: '#DC2626',
      confidence_level: '95% (Simulated AI Analysis)',
      probable_root_cause: 'Caustic dosing circulation pump pressure drop in primary wet flue gas desulphurization (FGD) scrubber.',
      environmental_and_health_risks: 'SO2 reading exceeds statutory CPCB 24-hr NAAQS limit (80 µg/m³). Severe bronchoconstriction risk for asthmatic and elderly populations in downwind residential buffer.',
      recommended_corrective_actions: [
        'Start standby alkaline recirculation pump B immediately.',
        'Check pH in scrubber liquor holding tank and adjust sodium hydroxide dosing to maintain pH > 7.5.',
        'Throttle boiler fuel feed by 20% until stack analyzer confirms SO2 < 70 µg/m³.'
      ],
      recommended_preventive_actions: [
        'Install dual redundant differential pressure sensors across scrubber nozzle header.',
        'Calibrate continuous emission monitoring system (CEMS) opacity and gas sensors.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('no2') || combined.includes('nitrogen')) {
    return {
      category: 'Environmental Pollution',
      predicted_category: 'Environmental Pollution',
      suggested_severity: 'High',
      severity_color: '#DC2626',
      confidence_level: '94% (Simulated AI Analysis)',
      probable_root_cause: 'Selective Non-Catalytic Reduction (SNCR) urea dosing skid pressure drop or furnace operating temperature exceeding 1400°C generating thermal NOx.',
      environmental_and_health_risks: 'NO2 concentration exceeds CPCB 24-hr standard (80 µg/m³). Severe pulmonary irritation, bronchiolitis obliterans risk, and atmospheric photochemical smog / ground-level ozone formation.',
      recommended_corrective_actions: [
        'Ramp up urea/ammonia aqueous injection rate into upper boiler furnace zone.',
        'Trim combustion air dampers to reduce excess O2 in furnace flue gas below 3.5%.',
        'Inspect NOx CEMS sampling probe for moisture condensation.'
      ],
      recommended_preventive_actions: [
        'Implement automated closed-loop oxygen and NOx trim combustion control.',
        'Schedule annual catalyst bed cleaning and activity testing for SCR reactor.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('co ') || combined.includes('carbon monoxide')) {
    return {
      category: 'Accidents & Emergencies',
      predicted_category: 'Accidents & Emergencies',
      suggested_severity: 'Critical',
      severity_color: '#DC2626',
      confidence_level: '95% (Simulated AI Analysis)',
      probable_root_cause: 'Incomplete combustion in enclosed furnace recuperator or leak in gas manifold ducting with faulty purge ventilation.',
      environmental_and_health_risks: 'CO binds with blood hemoglobin with 200x greater affinity than oxygen. Acute risk of asphyxiation and cognitive incapacitation in enclosed plant zones.',
      recommended_corrective_actions: [
        'Trigger area emergency evacuation alarm immediately.',
        'Activate explosion-proof mechanical positive-pressure ventilation exhausters.',
        'Deploy portable gas detectors with electrochemical CO sensors to trace leak source.'
      ],
      recommended_preventive_actions: [
        'Install fixed infrared / electrochemical continuous CO gas monitoring grid.',
        'Implement automated trip interlock on furnace gas feed tied to CO ambient levels.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  if (combined.includes('infrastructure') || combined.includes('sinkhole') || combined.includes('collapse') || combined.includes('pipe')) {
    return {
      category: 'Public Infrastructure',
      predicted_category: 'Public Infrastructure',
      suggested_severity: 'Moderate',
      severity_color: '#D97706',
      confidence_level: '90% (Simulated AI Analysis)',
      probable_root_cause: 'Underground stormwater or sewer conduit subsidence due to soil erosion and hydrostatic pressure fatigue.',
      environmental_and_health_risks: 'Underground conduit subsidence posing roadway collapse risk for heavy commercial freight, combined with civic drainage disruption.',
      recommended_corrective_actions: [
        'Cordon off 20m perimeter with reflective retro-barricades.',
        'Mobilize ground-penetrating radar (GPR) inspection crew.',
        'Notify Municipal Corporation Road Engineering division.'
      ],
      recommended_preventive_actions: [
        'Conduct bi-annual geotechnical acoustic survey of underground utility conduits.',
        'Upgrade drainage lines with reinforced spun concrete (RCC Class NP3) pipes.'
      ],
      model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
      source_label: 'Simulated AI Analysis',
      is_simulation: true,
      disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
    };
  }

  // Default: PM10 / PM2.5 particulate breach
  const isPm25 = combined.includes('pm2.5') || combined.includes('pm25');
  return {
    category: 'Environmental Pollution',
    predicted_category: 'Environmental Pollution',
    suggested_severity: 'High',
    severity_color: '#DC2626',
    confidence_level: isPm25 ? '94% (Simulated AI Analysis)' : '93% (Simulated AI Analysis)',
    probable_root_cause: isPm25
      ? 'Incomplete diesel generator combustion or open fugitive burning near raw material loading bay.'
      : 'Baghouse differential pressure collapse below 40 mmWC indicating filter cloth tear or pulse-jet purge solenoid valve seizure in Sector 2 crushing line.',
    environmental_and_health_risks: isPm25
      ? 'Fine combustion particles (PM2.5) breach CPCB 24-hr standard (60 µg/m³). Particles penetrate deep alveolar membranes with cardiovascular mortality correlation.'
      : 'PM10 concentration exceeds the mandatory CPCB NAAQS 24-hr threshold of 100 µg/m³ under Section 16(2)(h) of the Air (Prevention and Control of Pollution) Act 1981. Increased respiratory morbidity downwind.',
    recommended_corrective_actions: isPm25
      ? [
          'Halt non-essential DG set operations and switch to grid power.',
          'Deploy mobile water misting cannon across unpaved transit corridors.',
          'Enforce speed limit restriction (< 15 km/h) for heavy transport dumpers.'
        ]
      : [
          'Isolate damaged filter compartment 3 and divert flue stream to redundant bag bank.',
          'Activate stationary anti-smog misting cannons along perimeter fence.',
          'Notify plant shift supervisor to log statutory breach in Form IV environment register.'
        ],
    recommended_preventive_actions: isPm25
      ? [
          'Install particulate retrofits (RECD) on all heavy backup generators.',
          'Pave internal transit corridors with dense bituminous concrete.'
        ]
      : [
          'Replace torn needle-felt filtration bags with PTFE-membrane composite bags.',
          'Implement real-time continuous bag leak detection optical sensors.'
        ],
    model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
    source_label: 'Simulated AI Analysis',
    is_simulation: true,
    disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
  };
};

export default function ReportPage() {
  const [formData, setFormData] = useState({
    locationId: LOCATIONS[0].id,
    categoryId: CATEGORIES[0].id,
    pollutant: POLLUTANTS[0],
    severity: 'Moderate',
    suspectedSource: '',
    description: '',
    reporterName: '',
    reporterContact: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  // AI Diagnostics state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [diagnosticError, setDiagnosticError] = useState(null);
  const [appliedNotification, setAppliedNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.description.trim()) {
      errors.description = 'Please provide a detailed description of the incident.';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long.';
    }

    if (!formData.suspectedSource.trim()) {
      errors.suspectedSource = 'Please specify the suspected industrial source or area.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticError(null);
    setAppliedNotification(null);

    // Prompt user if neither description nor suspected source is entered
    if (!formData.description.trim() && !formData.suspectedSource.trim()) {
      setDiagnosticError('Please enter incident observations or a suspected source before running AI diagnostics.');
      return;
    }

    setIsDiagnosing(true);

    const locationObj = LOCATIONS.find((l) => l.id === formData.locationId);
    const locationLabel = locationObj ? locationObj.label : 'General Industrial Area';

    try {
      const payload = {
        incident_type: formData.pollutant,
        pollutant: formData.pollutant.split(' ')[0],
        observed_value: 'Field Exceedance Observation',
        cluster: locationLabel,
        location: locationLabel,
        severity: formData.severity,
        suspected_source: formData.suspectedSource,
        description: formData.description
      };

      const response = await fetch(`${API_BASE_URL}/diagnostics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.diagnostic) {
        setDiagnosticResult(data.diagnostic);
      } else {
        throw new Error(data.message || 'Diagnostic service returned unsuccessful response');
      }
    } catch (err) {
      console.warn('Backend diagnostic request failed, executing transparent client rule fallback:', err);
      const localResult = runLocalDiagnosticFallback(
        formData.pollutant,
        formData.pollutant.split(' ')[0],
        formData.description,
        formData.suspectedSource
      );
      setDiagnosticResult(localResult);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const applyDiagnosticSuggestions = () => {
    if (!diagnosticResult) return;

    const suggestedSeverity = diagnosticResult.suggested_severity;
    const categoryId = mapCategoryToId(diagnosticResult.predicted_category || diagnosticResult.category);

    setFormData((prev) => ({
      ...prev,
      severity: suggestedSeverity || prev.severity,
      categoryId: categoryId || prev.categoryId
    }));

    setAppliedNotification('Applied suggested category and severity to report!');
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        category_id: formData.categoryId,
        location_id: formData.locationId,
        incident_type: formData.pollutant,
        pollutant: formData.pollutant.split(' ')[0],
        severity: formData.severity,
        suspected_source: formData.suspectedSource,
        description: formData.description,
        reporter_name: formData.reporterName.trim() || 'Anonymous Citizen',
        reporter_contact: formData.reporterContact.trim() || null
      };

      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || (data.errors ? data.errors.join(', ') : 'Failed to submit incident'));
      }

      setSubmissionSuccess(data.incident);
    } catch (err) {
      console.error('Submission failed:', err);
      setServerError(err.message || 'Network error connecting to backend service. Please ensure Express backend is running on port 5000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      locationId: LOCATIONS[0].id,
      categoryId: CATEGORIES[0].id,
      pollutant: POLLUTANTS[0],
      severity: 'Moderate',
      suspectedSource: '',
      description: '',
      reporterName: '',
      reporterContact: ''
    });
    setValidationErrors({});
    setSubmissionSuccess(null);
    setServerError(null);
    setDiagnosticResult(null);
    setDiagnosticError(null);
    setAppliedNotification(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#202923] tracking-tight">
            Report Pollution Incident
          </h1>
          <p className="text-xs text-[#77827B] mt-1">
            Log an industrial emission exceedance, black smoke plume, or equipment failure
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Success Banner */}
      {submissionSuccess && (
        <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-6 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#059669] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#065F46]">
                Incident Ticket Logged Successfully
              </h3>
              <p className="text-xs text-[#047857]">
                Your report has been inserted into the Supabase database with status <span className="font-semibold uppercase text-[#065F46] bg-[#D1FAE5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">Submitted</span>.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-4 border border-[#A7F3D0] text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-[#E6EBE7]">
              <span className="text-[#77827B] font-medium">Tracking Code:</span>
              <span className="font-mono font-bold text-[#202923]">{submissionSuccess.tracking_code}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#E6EBE7]">
              <span className="text-[#77827B] font-medium">Incident Type:</span>
              <span className="font-semibold text-[#202923]">{submissionSuccess.incident_type}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#E6EBE7]">
              <span className="text-[#77827B] font-medium">Severity:</span>
              <span className="font-semibold text-[#B91C1C]">{submissionSuccess.severity}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#77827B] font-medium">Logged At:</span>
              <span className="text-[#202923]">{new Date(submissionSuccess.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-[#174B35] hover:bg-[#103B2B] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Report Another Incident
            </button>
            <Link
              to="/incidents"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#A7F3D0] text-[#065F46] hover:bg-[#F0FDF4] font-semibold text-xs transition-colors"
            >
              <span>View All Incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {serverError && (
        <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-4 flex items-start gap-3 text-xs text-[#991B1B]">
          <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Submission Error</p>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Incident Form */}
      {!submissionSuccess && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white border border-[#E6EBE7] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="locationId" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Monitoring Station / Cluster
              </label>
              <select
                id="locationId"
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="w-full text-xs rounded-lg border border-[#E6EBE7] p-3 focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35] bg-white text-[#202923]"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Incident Domain
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full text-xs rounded-lg border border-[#E6EBE7] p-3 focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35] bg-white text-[#202923]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pollutant" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Observed Pollutant / Issue Type
              </label>
              <select
                id="pollutant"
                name="pollutant"
                value={formData.pollutant}
                onChange={handleChange}
                className="w-full text-xs rounded-lg border border-[#E6EBE7] p-3 focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35] bg-white text-[#202923]"
              >
                {POLLUTANTS.map((pol) => (
                  <option key={pol} value={pol}>
                    {pol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Estimated Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full text-xs rounded-lg border border-[#E6EBE7] p-3 focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35] bg-white text-[#202923]"
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev.value} value={sev.value}>
                    {sev.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="suspectedSource" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Suspected Industrial Source <span className="text-[#DC2626]">*</span>
              </label>
              <input
                id="suspectedSource"
                type="text"
                name="suspectedSource"
                value={formData.suspectedSource}
                onChange={handleChange}
                placeholder="e.g. Boiler Flue 4, Caustic Scrubber Pump, DG Stack"
                className={`w-full text-xs rounded-lg border p-3 focus:outline-none focus:ring-1 text-[#202923] placeholder:text-[#77827B]/60 ${
                  validationErrors.suspectedSource
                    ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626] bg-[#FEF2F2]/40'
                    : 'border-[#E6EBE7] focus:border-[#174B35] focus:ring-[#174B35] bg-white'
                }`}
              />
              {validationErrors.suspectedSource && (
                <p className="text-[11px] text-[#DC2626] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{validationErrors.suspectedSource}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reporterName" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
                Reporter Name <span className="text-[#77827B] text-[10px] font-normal lowercase">(optional)</span>
              </label>
              <input
                id="reporterName"
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Leave blank for anonymous citizen"
                className="w-full text-xs rounded-lg border border-[#E6EBE7] p-3 focus:outline-none focus:border-[#174B35] focus:ring-1 focus:ring-[#174B35] bg-white text-[#202923] placeholder:text-[#77827B]/60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-[#202923] uppercase tracking-wider mb-2">
              Incident Description & Observations <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe visible emissions, dense black smoke plume, acid odor, wind direction, or process malfunctions..."
              className={`w-full text-xs rounded-lg border p-3 focus:outline-none focus:ring-1 text-[#202923] placeholder:text-[#77827B]/60 ${
                validationErrors.description
                  ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626] bg-[#FEF2F2]/40'
                  : 'border-[#E6EBE7] focus:border-[#174B35] focus:ring-[#174B35] bg-white'
              }`}
            ></textarea>
            {validationErrors.description && (
              <p className="text-[11px] text-[#DC2626] mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validationErrors.description}</span>
              </p>
            )}
          </div>

          {/* AI Incident Diagnostics & Root-Cause Analysis Section */}
          <div className="rounded-xl border border-[#D1FAE5] bg-gradient-to-br from-[#F0FDF4] to-[#F8FAFC] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#174B35] flex items-center justify-center text-white shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#202923]">
                    AI Incident Diagnostics & Root-Cause Analysis
                  </h3>
                </div>
                <p className="text-xs text-[#77827B] max-w-xl">
                  Run algorithmic inference on observed emissions, pollutant type, and industrial sector to predict statutory category, suggested severity, root causes, and recommended CAPA before logging.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunDiagnostics}
                disabled={isDiagnosing}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-xs shadow-xs transition-all shrink-0 ${
                  isDiagnosing
                    ? 'bg-[#174B35]/70 cursor-not-allowed'
                    : 'bg-[#174B35] hover:bg-[#103B2B] cursor-pointer'
                }`}
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Heuristics...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4 text-white" />
                    <span>Run AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Prompt Warning */}
            {diagnosticError && (
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-3 flex items-center gap-2 text-xs text-[#991B1B]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span>{diagnosticError}</span>
              </div>
            )}

            {/* Notification when suggestions applied */}
            {appliedNotification && (
              <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-3 flex items-center gap-2 text-xs text-[#065F46]">
                <Check className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="font-semibold">{appliedNotification}</span>
              </div>
            )}

            {/* Diagnostic Results Card */}
            {diagnosticResult && (
              <div className="rounded-lg bg-white border border-[#A7F3D0] p-4 sm:p-5 shadow-xs space-y-4">
                {/* Status Badges & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6EBE7]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                      {diagnosticResult.source_label || (diagnosticResult.is_simulation ? 'Simulated AI Analysis' : 'Gemini AI Analysis')}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F4F6F4] text-[#202923] border border-[#E6EBE7]">
                      Confidence: <strong className="text-[#174B35] font-semibold">{diagnosticResult.confidence_level || '93% (Simulated AI Analysis)'}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={applyDiagnosticSuggestions}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#A7F3D0] text-[#065F46] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Suggestions to Form</span>
                  </button>
                </div>

                {/* Key Categorization & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#77827B] tracking-wider block">
                      Predicted Incident Category
                    </span>
                    <span className="text-xs font-bold text-[#202923] mt-0.5 block">
                      {diagnosticResult.predicted_category || diagnosticResult.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#77827B] tracking-wider block">
                      Suggested Severity
                    </span>
                    <span 
                      className="inline-block text-xs font-bold px-2 py-0.5 rounded text-white mt-1 shadow-2xs"
                      style={{ backgroundColor: diagnosticResult.severity_color || '#DC2626' }}
                    >
                      {diagnosticResult.suggested_severity}
                    </span>
                  </div>
                </div>

                {/* Detailed Analysis Breakdown */}
                <div className="space-y-3 text-xs">
                  {/* Probable Root Cause */}
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#B45309] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Probable Root Cause</span>
                    </div>
                    <p className="text-[#92400E] leading-relaxed">
                      {diagnosticResult.probable_root_cause || diagnosticResult.likely_cause}
                    </p>
                  </div>

                  {/* Environmental & Public Health Risks */}
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#B91C1C] font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Environmental and Public Health Risks</span>
                    </div>
                    <p className="text-[#991B1B] leading-relaxed">
                      {diagnosticResult.environmental_and_health_risks || diagnosticResult.risk_explanation}
                    </p>
                  </div>

                  {/* Corrective Actions */}
                  <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Recommended Corrective Actions (Immediate)</span>
                    </div>
                    <ul className="list-decimal list-inside space-y-1 text-[#166534]">
                      {(diagnosticResult.recommended_corrective_actions || diagnosticResult.immediate_actions || []).map((action, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preventive Actions (Long-Term CAPA) */}
                  <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#1D4ED8] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recommended Preventive Actions (Long-Term CAPA)</span>
                    </div>
                    <ul className="list-decimal list-inside space-y-1 text-[#1E40AF]">
                      {(diagnosticResult.recommended_preventive_actions || diagnosticResult.long_term_capa || []).map((action, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="pt-2 border-t border-[#E6EBE7] flex items-center gap-1.5 text-[11px] text-[#77827B] italic">
                  <Info className="w-3.5 h-3.5 shrink-0 text-[#77827B]" />
                  <span>{diagnosticResult.disclaimer || 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-[#E6EBE7]">
            <span className="text-xs text-[#77827B]">
              * Incident will be directly committed to Supabase and trigger automated CPCB assessment
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold text-xs shadow-xs transition-all ${
                isSubmitting
                  ? 'bg-[#174B35]/70 cursor-not-allowed'
                  : 'bg-[#174B35] hover:bg-[#103B2B] cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging to Supabase...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
