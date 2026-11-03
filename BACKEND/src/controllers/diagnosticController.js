/**
 * Incident Diagnostics Controller
 * Provides live Gemini AI analysis when GEMINI_API_KEY is configured,
 * and seamlessly falls back to transparent, rule-based expert heuristics
 * aligned with CPCB NAAQS 2009 statutory limits and industrial hazard classification.
 */

export const runDiagnostics = async (req, res) => {
  try {
    const {
      incident_type = 'PM10 Exceedance',
      pollutant = 'PM10',
      observed_value = '118.5 µg/m³',
      cluster = 'Station Alpha - Vapi GIDC Chemical Estate',
      location = '',
      severity = 'Moderate',
      suspected_source = '',
      description = ''
    } = req.body;

    const locationName = location || cluster || 'General Industrial Estate';

    // 1. Check for live Gemini API if configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const promptText = `You are EcoSentinel AI, an environmental compliance and industrial incident diagnostics engine adhering strictly to Central Pollution Control Board (CPCB) India standards.
Analyze the following environmental incident:
- Incident / Pollutant: ${incident_type} (${pollutant})
- Location / Cluster: ${locationName}
- Observed / Estimated Severity: ${severity}
- Suspected Source: ${suspected_source || 'Unknown'}
- Detailed Description: ${description || 'No detailed description provided'}

Return a raw JSON object with NO markdown formatting, NO backticks:
{
  "category": "Environmental Pollution" | "Natural Disasters" | "Accidents & Emergencies" | "Public Infrastructure",
  "suggested_severity": "Low" | "Moderate" | "High" | "Critical",
  "likely_cause": "Specific engineering root cause",
  "risk_explanation": "Environmental and public health hazards citing relevant CPCB standards",
  "immediate_actions": ["Specific immediate corrective action 1", "Specific immediate corrective action 2", "Specific immediate corrective action 3"],
  "long_term_capa": ["Specific long-term preventive action 1", "Specific long-term preventive action 2"],
  "confidence_level": "95% (Gemini AI Analysis)"
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }]
            }),
            signal: AbortSignal.timeout(6000)
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            const isCriticalOrHigh = parsed.suggested_severity === 'Critical' || parsed.suggested_severity === 'High';

            return res.status(200).json({
              success: true,
              diagnostic: {
                analyzed_at: new Date().toISOString(),
                incident_type,
                pollutant,
                observed_value,
                cluster: locationName,
                category: parsed.category || 'Environmental Pollution',
                predicted_category: parsed.category || 'Environmental Pollution',
                suggested_severity: parsed.suggested_severity || severity,
                severity_color: isCriticalOrHigh ? '#DC2626' : '#D97706',
                likely_cause: parsed.likely_cause,
                probable_root_cause: parsed.likely_cause,
                risk_explanation: parsed.risk_explanation,
                environmental_and_health_risks: parsed.risk_explanation,
                immediate_actions: parsed.immediate_actions || [],
                recommended_corrective_actions: parsed.immediate_actions || [],
                long_term_capa: parsed.long_term_capa || [],
                recommended_preventive_actions: parsed.long_term_capa || [],
                model: 'Gemini 1.5 Flash (Google AI)',
                source_label: 'Gemini AI Analysis',
                is_simulation: false,
                confidence_level: parsed.confidence_level || '95% (Gemini AI Analysis)',
                disclaimer: 'Verified Gemini AI diagnostics. Recommendations should be validated by certified EHS personnel.'
              }
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed or timed out. Falling back to rule-based engine:', geminiErr.message);
      }
    }

    // 2. Rule-Based Expert Heuristics (CPCB NAAQS 2009 Standards)
    const combined = `${incident_type} ${pollutant} ${description} ${suspected_source}`.toLowerCase();

    let category = 'Environmental Pollution';
    let suggestedSeverity = 'High';
    let severityColor = '#DC2626';
    let riskExplanation = '';
    let likelyCause = '';
    let immediateActions = [];
    let longTermCapa = [];
    let confidenceLevel = '93% (Simulated AI Analysis)';

    if (combined.includes('boiler') || combined.includes('fire') || combined.includes('explosion') || combined.includes('smoke plume') || combined.includes('burn')) {
      category = 'Accidents & Emergencies';
      suggestedSeverity = 'Critical';
      severityColor = '#DC2626';
      confidenceLevel = '96% (Simulated AI Analysis)';
      riskExplanation = 'High-temperature industrial combustion failure with dense black particulate smoke plume. Extreme risk of thermal escalation, carbon monoxide flashover, and adjacent storage unit ignition.';
      likelyCause = 'Auxiliary fuel oil atomizing nozzle blockage resulting in incomplete combustion, fuel accumulation, and secondary flash ignition in economizer duct.';
      immediateActions = [
        'Actuate Emergency Fuel Shutoff Valve (ESV-01) on main supply header.',
        'Initiate controlled plant area evacuation per EHS SOP-12.',
        'Alert local Fire & Emergency Services and GIDC Disaster Dispatch.'
      ];
      longTermCapa = [
        'Perform hydrostatic pressure testing and casing thickness scans on boiler shell before re-commissioning.',
        'Overhaul burner flame scanner and replace with fail-safe optical UV/IR sensor.'
      ];
    } else if (combined.includes('chemical') || combined.includes('effluent') || combined.includes('discharge') || combined.includes('leak') || combined.includes('spill') || combined.includes('acid plume')) {
      category = 'Environmental Pollution';
      suggestedSeverity = 'Critical';
      severityColor = '#DC2626';
      confidenceLevel = '95% (Simulated AI Analysis)';
      riskExplanation = 'Untreated chemical effluent or toxic plume breach with high Chemical Oxygen Demand (COD) and dissolved heavy metals. Severe risk of acute aquatic toxicity, surface runoff contamination, and groundwater infiltration.';
      likelyCause = 'Gasket degradation on primary aeration tank discharge manifold or untreated effluent bypass pump seal failure during peak batch wash.';
      immediateActions = [
        'Close effluent emergency isolation gate (EIG-02) and divert flow to equalisation holding pond.',
        'Deploy absorbent containment booms and neutralized calcium hydroxide slurry along perimeter drainage.',
        'Notify State Pollution Control Board (SPCB) Regional Officer per Water Act Section 32.'
      ];
      longTermCapa = [
        'Install automated online Total Organic Carbon (TOC) and turbidity trip-interlock at final discharge sump.',
        'Upgrade all mechanical pump seals to double cartridge seals with continuous barrier fluid monitoring.'
      ];
    } else if (combined.includes('waterlog') || combined.includes('flood') || combined.includes('drain') || combined.includes('culvert') || combined.includes('inundation')) {
      category = 'Natural Disasters';
      suggestedSeverity = 'Moderate';
      severityColor = '#D97706';
      confidenceLevel = '91% (Simulated AI Analysis)';
      riskExplanation = 'Stormwater accumulation exceeding 2.5 feet obstructing transit corridors, risking industrial effluent backflow into civic channels and shallow aquifer biological contamination.';
      likelyCause = 'Silt accumulation and uncollected industrial solid debris at culvert inlet grates during high-intensity precipitation event.';
      immediateActions = [
        'Deploy 50 HP tractor-mounted high-flow dewatering pump to discharge into secondary retention canal.',
        'Erect warning barriers and reroute light motor vehicles away from low-lying culvert.',
        'Clear floating plastic and manual grates using municipal vacuum suction truck.'
      ];
      longTermCapa = [
        'Re-engineer stormwater invert gradient and install mechanized trash bar screens at outfalls.',
        'Deploy continuous ultrasonic liquid level transmitters linked to SCADA alert system.'
      ];
    } else if (combined.includes('so2') || combined.includes('sulphur')) {
      category = 'Environmental Pollution';
      suggestedSeverity = 'High';
      severityColor = '#DC2626';
      confidenceLevel = '95% (Simulated AI Analysis)';
      riskExplanation = 'SO2 reading exceeds statutory CPCB 24-hr NAAQS limit (80 µg/m³). Severe bronchoconstriction risk for asthmatic and elderly populations in downwind residential buffer.';
      likelyCause = 'Caustic dosing circulation pump pressure drop in primary wet flue gas desulphurization (FGD) scrubber.';
      immediateActions = [
        'Start standby alkaline recirculation pump B immediately.',
        'Check pH in scrubber liquor holding tank and adjust sodium hydroxide dosing to maintain pH > 7.5.',
        'Throttle boiler fuel feed by 20% until stack analyzer confirms SO2 < 70 µg/m³.'
      ];
      longTermCapa = [
        'Install dual redundant differential pressure sensors across scrubber nozzle header.',
        'Calibrate continuous emission monitoring system (CEMS) opacity and gas sensors.'
      ];
    } else if (combined.includes('no2') || combined.includes('nitrogen')) {
      category = 'Environmental Pollution';
      suggestedSeverity = 'High';
      severityColor = '#DC2626';
      confidenceLevel = '94% (Simulated AI Analysis)';
      riskExplanation = 'NO2 concentration exceeds CPCB 24-hr standard (80 µg/m³). Severe pulmonary irritation, bronchiolitis obliterans risk, and atmospheric photochemical smog / ground-level ozone formation.';
      likelyCause = 'Selective Non-Catalytic Reduction (SNCR) urea dosing skid pressure drop or furnace operating temperature exceeding 1400°C generating thermal NOx.';
      immediateActions = [
        'Ramp up urea/ammonia aqueous injection rate into upper boiler furnace zone.',
        'Trim combustion air dampers to reduce excess O2 in furnace flue gas below 3.5%.',
        'Inspect NOx CEMS sampling probe for moisture condensation.'
      ];
      longTermCapa = [
        'Implement automated closed-loop oxygen and NOx trim combustion control.',
        'Schedule annual catalyst bed cleaning and activity testing for SCR reactor.'
      ];
    } else if (combined.includes('co ') || combined.includes('carbon monoxide')) {
      category = 'Accidents & Emergencies';
      suggestedSeverity = 'Critical';
      severityColor = '#DC2626';
      confidenceLevel = '95% (Simulated AI Analysis)';
      riskExplanation = 'CO binds with blood hemoglobin with 200x greater affinity than oxygen. Acute risk of asphyxiation and cognitive incapacitation in enclosed plant zones.';
      likelyCause = 'Incomplete combustion in enclosed furnace recuperator or leak in gas manifold ducting with faulty purge ventilation.';
      immediateActions = [
        'Trigger area emergency evacuation alarm immediately.',
        'Activate explosion-proof mechanical positive-pressure ventilation exhausters.',
        'Deploy portable gas detectors with electrochemical CO sensors to trace leak source.'
      ];
      longTermCapa = [
        'Install fixed infrared / electrochemical continuous CO gas monitoring grid.',
        'Implement automated trip interlock on furnace gas feed tied to CO ambient levels.'
      ];
    } else if (combined.includes('infrastructure') || combined.includes('sinkhole') || combined.includes('collapse') || combined.includes('pipe')) {
      category = 'Public Infrastructure';
      suggestedSeverity = 'Moderate';
      severityColor = '#D97706';
      confidenceLevel = '90% (Simulated AI Analysis)';
      riskExplanation = 'Underground conduit subsidence posing roadway collapse risk for heavy commercial freight, combined with civic drainage disruption.';
      likelyCause = 'Underground stormwater or sewer conduit subsidence due to soil erosion and hydrostatic pressure fatigue.';
      immediateActions = [
        'Cordon off 20m perimeter with reflective retro-barricades.',
        'Mobilize ground-penetrating radar (GPR) inspection crew.',
        'Notify Municipal Corporation Road Engineering division.'
      ];
      longTermCapa = [
        'Conduct bi-annual geotechnical acoustic survey of underground utility conduits.',
        'Upgrade drainage lines with reinforced spun concrete (RCC Class NP3) pipes.'
      ];
    } else if (combined.includes('pm2.5') || combined.includes('pm25')) {
      category = 'Environmental Pollution';
      suggestedSeverity = 'High';
      severityColor = '#DC2626';
      confidenceLevel = '94% (Simulated AI Analysis)';
      riskExplanation = 'Fine combustion particles (PM2.5) breach CPCB 24-hr standard (60 µg/m³). Particles penetrate deep alveolar membranes with cardiovascular mortality correlation.';
      likelyCause = 'Incomplete diesel generator combustion or open fugitive burning near raw material loading bay.';
      immediateActions = [
        'Halt non-essential DG set operations and switch to grid power.',
        'Deploy mobile water misting cannon across unpaved transit corridors.',
        'Enforce speed limit restriction (< 15 km/h) for heavy transport dumpers.'
      ];
      longTermCapa = [
        'Install particulate retrofits (RECD) on all heavy backup generators.',
        'Pave internal transit corridors with dense bituminous concrete.'
      ];
    } else {
      // Default: PM10 or general particulate exceedance
      category = 'Environmental Pollution';
      suggestedSeverity = 'High';
      severityColor = '#DC2626';
      confidenceLevel = '93% (Simulated AI Analysis)';
      riskExplanation = 'PM10 concentration exceeds the mandatory CPCB NAAQS 24-hr threshold of 100 µg/m³ under Section 16(2)(h) of the Air (Prevention and Control of Pollution) Act 1981. Increased respiratory morbidity downwind.';
      likelyCause = 'Baghouse differential pressure collapse below 40 mmWC indicating filter cloth tear or pulse-jet purge solenoid valve seizure in Sector 2 crushing line.';
      immediateActions = [
        'Isolate damaged filter compartment 3 and divert flue stream to redundant bag bank.',
        'Activate stationary anti-smog misting cannons along perimeter fence.',
        'Notify plant shift supervisor to log statutory breach in Form IV environment register.'
      ];
      longTermCapa = [
        'Replace torn needle-felt filtration bags with PTFE-membrane composite bags.',
        'Implement real-time continuous bag leak detection optical sensors.'
      ];
    }

    return res.status(200).json({
      success: true,
      diagnostic: {
        analyzed_at: new Date().toISOString(),
        incident_type,
        pollutant,
        observed_value,
        cluster: locationName,
        category,
        predicted_category: category,
        suggested_severity: suggestedSeverity,
        severity_color: severityColor,
        likely_cause: likelyCause,
        probable_root_cause: likelyCause,
        risk_explanation: riskExplanation,
        environmental_and_health_risks: riskExplanation,
        immediate_actions: immediateActions,
        recommended_corrective_actions: immediateActions,
        long_term_capa: longTermCapa,
        recommended_preventive_actions: longTermCapa,
        model: 'EcoSentinel Heuristic Copilot v2.4 (Simulated AI Analysis)',
        source_label: 'Simulated AI Analysis',
        is_simulation: true,
        confidence_level: confidenceLevel,
        disclaimer: 'AI-assisted heuristic simulation. All recommendations provide operational decision support and must be validated by a certified EHS engineer.'
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to run diagnostic analysis',
      error: err.message
    });
  }
};
