# EcoSentinel AI - Technical Design Document (TDD)

**Project Name:** EcoSentinel AI  
**Sub-title:** Unified Environmental & Incident Intelligence Platform  
**Architecture:** Decoupled Full-Stack Web Application (SPA + REST API)  
**Frontend Stack:** React 19, Vite, Tailwind CSS, Lucide React, Recharts, Leaflet & React Leaflet  
**Backend Stack:** Node.js, Express.js (ES Modules), Supabase PostgreSQL Client, Google Gemini API SDK  
**Database:** PostgreSQL (Supabase Cloud)  
**Target Milestone:** Hackathon MVP (Single-Developer Architecture)  

---

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph "Frontend Client (React 19 + Vite)"
        Router[React Router DOM]
        DashboardView[1. Global Dashboard '/']
        ReportView[2. Report Incident '/report']
        IntelView[3. AI Intelligence '/intelligence']
        ComplianceView[4. Compliance Checker '/compliance']
        IncidentView[5. Incident Management '/incidents']
        MapView[6. Global Incident Map '/map']
        SettingsView[7. Settings '/settings']
        
        Router --> DashboardView
        Router --> ReportView
        Router --> IntelView
        Router --> ComplianceView
        Router --> IncidentView
        Router --> MapView
        Router --> SettingsView
    end

    subgraph "Backend API (Node.js + Express)"
        ExpressServer[Express Server :5000]
        Middleware[CORS + JSON Parser + Error Handler]
        
        subgraph "Controllers & Route Handlers"
            IncidentsCtrl[incidentsController.js]
            TelemetryCtrl[telemetryController.js]
            ComplianceCtrl[complianceController.js]
            AICtrl[aiController.js]
            LocationsCtrl[locationsController.js]
        end
        
        subgraph "Domain Engines & Services"
            CPCBEngine[cpcbRulesEngine.js<br/>NAAQS 2009 Standards Checker]
            AQIEngine[aqiCalculator.js<br/>CPCB AQI 2014 Breakpoint Engine]
            AnomalyEngine[anomalyDetector.js<br/>Surge Heuristic & Trajectory]
            GeminiService[geminiService.js<br/>Incident Triage & Advisory Pipeline]
        end
    end

    subgraph "External Data & AI Services"
        Supabase[(Supabase PostgreSQL<br/>10 Relational Tables)]
        GeminiAPI[Google Gemini API<br/>gemini-1.5-flash / gemini-2.0-flash]
    end

    Frontend Client -->|REST API Calls /api/*| ExpressServer
    ExpressServer --> Middleware
    Middleware --> IncidentsCtrl
    Middleware --> TelemetryCtrl
    Middleware --> ComplianceCtrl
    Middleware --> AICtrl
    Middleware --> LocationsCtrl

    IncidentsCtrl --> Supabase
    LocationsCtrl --> Supabase
    TelemetryCtrl --> AnomalyEngine
    TelemetryCtrl --> Supabase
    ComplianceCtrl --> CPCBEngine
    ComplianceCtrl --> AQIEngine
    ComplianceCtrl --> Supabase

    AICtrl --> GeminiService
    GeminiService --> GeminiAPI
    GeminiService -->|Log AI Audit| Supabase
```

---

## 2. Frontend Application Design (React 19 + Vite)

### 2.1 Route Architecture & Page Structure
The frontend application uses React Router with seven top-level navigation routes wrapped in a common layout:

| Route Path | Component Name | Functional Role |
| :--- | :--- | :--- |
| `/` | `DashboardPage.jsx` | Executive summary metrics, active emergency tickers, ambient air overview, and Leaflet mini-map preview. |
| `/report` | `ReportIncidentPage.jsx` | Unified incident intake form supporting all 4 categories, photo evidence preview, map pin selection, and severity assignment. |
| `/intelligence` | `IntelligencePage.jsx` | AI-assisted incident triage copilot, operational anomaly spike logs, linear trend projections, and advisory containment plans. |
| `/compliance` | `CompliancePage.jsx` | CPCB NAAQS 2009 statutory evaluation grid, discrete 24h/8h/1h averages, $75\%$ data completeness indicators, and AQI comparison. |
| `/incidents` | `IncidentManagementPage.jsx` | Multi-category incident management hub, 7-stage status workflow, department assignment modals, and CAPA resolution tracking. |
| `/map` | `GlobalMapPage.jsx` | Full-screen interactive Leaflet map displaying active incidents across all 4 domains alongside ambient air monitoring stations. |
| `/settings` | `SettingsPage.jsx` | Station metadata editor, simulated scenario toggles, threshold overrides, API status checks, and data export. |

### 2.2 Leaflet Geospatial Map Architecture
The mapping system integrates `leaflet` and `react-leaflet` with OpenStreetMap Carto tiles:
* **Custom Marker Design:** High-visibility SVG div-icons representing:
  * **Station Markers:** Circular badges colored by AQI band (Green: Good, Amber: Moderate, Red: Poor/Very Poor, Purple: Severe).
  * **Incident Markers:** Warning-triangle glyphs colored by incident severity (Amber: Low, Orange: Moderate, Red: High, Crimson/Purple: Critical).
* **Popup Overlays:** Informative overlays detailing pollutant concentrations, compliance status, or incident description with a one-click button to inspect full ticket details.
* **Filter Bar:** Real-time client-side filter controls enabling simultaneous filtering by Domain (All, Environmental, Disaster, Emergency, Infrastructure) and Severity.

---

## 3. Backend Architecture & Controller Hierarchy (Express.js)

The backend is built with ES modules in Node.js, structured for single-developer clarity and high testability without unnecessary microservice overhead:

```text
BACKEND/
├── src/
│   ├── config/
│   │   ├── env.js                 # Environment variable validation
│   │   ├── supabase.js            # Supabase PostgreSQL client initialization
│   │   └── gemini.js              # Google Gen AI SDK client configuration
│   ├── controllers/
│   │   ├── incidentsController.js  # CRUD & lifecycle state transitions for incidents
│   │   ├── telemetryController.js  # Real-time & historical air sensor telemetry
│   │   ├── complianceController.js # CPCB NAAQS statutory evaluation & AQI scoring
│   │   ├── aiController.js         # Gemini incident triage & technical copilot
│   │   └── locationsController.js  # Geographic coordinates and preset regions
│   ├── services/
│   │   ├── cpcbRulesEngine.js      # Exact 2009 Gazette standards & 75% data capture logic
│   │   ├── aqiCalculator.js        # CPCB 2014 piecewise linear AQI interpolation
│   │   ├── anomalyDetector.js      # 40% surge heuristic & OLS linear forecasting
│   │   └── geminiService.js        # Structured prompts, safety wrappers, audit logging
│   ├── routes/
│   │   ├── incidentsRoutes.js
│   │   ├── telemetryRoutes.js
│   │   ├── complianceRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── locationsRoutes.js
│   │   └── healthRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js         # Centralized error handler
│   │   └── requestValidator.js     # Payload validation middleware
│   └── server.js                   # Express application entrypoint
├── .env
├── .env.example
├── .gitignore
└── package.json
```

---

## 4. REST API Specification

### 4.1 Health & Diagnostics
* `GET /api/health`
  * Response: `{ "success": true, "status": "UP", "timestamp": "...", "version": "1.0.0" }`

### 4.2 Incidents Management (`/api/incidents`)
* `GET /api/incidents`
  * Query parameters: `category`, `severity`, `status`, `limit`, `offset`.
  * Response: List of incidents with joined category, location, and latest status.
* `POST /api/incidents`
  * Body: `{ category_id, incident_type, location_id, latitude, longitude, address, severity, description, reporter_name, reporter_contact, evidence_urls }`
  * Action: Generates `INC-YYYY-XXXXX` tracking code, sets status `Submitted`, persists record and evidence.
* `GET /api/incidents/:id`
  * Returns complete incident dossier including updates, assignments, evidence, and linked CAPA records.
* `PATCH /api/incidents/:id/status`
  * Body: `{ status, note, updated_by }`
  * Validates state machine rules (e.g. `Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Verified` / `Rejected`).
* `POST /api/incidents/:id/assign`
  * Body: `{ assigned_department, assigned_to_name, priority, target_completion_time }`

### 4.3 Air Telemetry & Sensors (`/api/telemetry`)
* `GET /api/telemetry/latest`
  * Query parameters: `station_id` (optional).
  * Returns latest readings for all stations with `[SIMULATED DATA]` provenance flags, AQI scores, and compliance status.
* `GET /api/telemetry/history`
  * Query parameters: `station_id`, `duration_hours` (default: 24).
  * Returns time-series observations for chart rendering.
* `POST /api/telemetry/simulate-spike`
  * Body: `{ station_id, pollutant, magnitude_multiplier }`
  * Injects controlled emission surge for interactive demonstration of the $40\%$ surge heuristic.

### 4.4 Environmental Compliance (`/api/compliance`)
* `GET /api/compliance/summary`
  * Computes discrete 24-hr, 8-hr, and 1-hr averages for active stations, validates $\ge 75\%$ data completeness, and flags binary `COMPLIANT` vs `STATUTORY BREACH`.
* `GET /api/compliance/standards`
  * Returns official CPCB NAAQS 2009 statutory limit table and CPCB AQI 2014 breakpoint references.

### 4.5 AI Incident Intelligence (`/api/advisory`)
* `POST /api/advisory/incident-triage`
  * Body: `{ incident_id }`
  * Calls Gemini API to produce structured triage analysis: root cause hypothesis, immediate containment steps, emergency resources, and CAPA suggestions.
* `POST /api/advisory/air-compliance`
  * Body: `{ station_id, pollutant, recorded_value, standard_limit }`
  * Calls Gemini API for industrial engineering guidance (scrubber adjustments, baghouse inspection, combustion control).

---

## 5. Regulatory Logic Implementation Details

### 5.1 CPCB NAAQS Evaluation Engine (`cpcbRulesEngine.js`)

```javascript
export const CPCB_NAAQS_2009 = {
  PM25: { name: 'PM2.5', unit: 'µg/m³', limit_24h: 60, limit_annual: 40 },
  PM10: { name: 'PM10', unit: 'µg/m³', limit_24h: 100, limit_annual: 60 },
  SO2:  { name: 'SO2',   unit: 'µg/m³', limit_24h: 80,  limit_annual: 50 },
  NO2:  { name: 'NO2',   unit: 'µg/m³', limit_24h: 80,  limit_annual: 40 },
  CO:   { name: 'CO',    unit: 'mg/m³', limit_8h: 2.0,  limit_1h: 4.0 },
  O3:   { name: 'O3',    unit: 'µg/m³', limit_8h: 100,  limit_1h: 180 }
};

export function evaluateCompliance(readings, pollutant, standardWindow = '24h') {
  // 1. Validate data completeness (Minimum 75% valid samples)
  const requiredCount = standardWindow === '24h' ? 24 : standardWindow === '8h' ? 8 : 1;
  const validSamples = readings.filter(r => r[pollutant.toLowerCase()] !== null && !isNaN(r[pollutant.toLowerCase()]));
  
  const completeness = validSamples.length / requiredCount;
  if (completeness < 0.75) {
    return {
      status: 'INSUFFICIENT_DATA_CAPTURE',
      completenessPercent: (completeness * 100).toFixed(1),
      isCompliant: null,
      message: 'CPCB requires at least 75% data capture for statutory assessment.'
    };
  }

  // 2. Compute arithmetic mean
  const sum = validSamples.reduce((acc, curr) => acc + Number(curr[pollutant.toLowerCase()]), 0);
  const average = sum / validSamples.length;
  
  // 3. Evaluate against statutory limit
  const limit = standardWindow === '24h' 
    ? CPCB_NAAQS_2009[pollutant].limit_24h 
    : standardWindow === '8h' 
      ? CPCB_NAAQS_2009[pollutant].limit_8h 
      : CPCB_NAAQS_2009[pollutant].limit_1h;
      
  const isBreach = average > limit;
  return {
    status: isBreach ? 'STATUTORY_BREACH' : 'COMPLIANT',
    isCompliant: !isBreach,
    average: Number(average.toFixed(2)),
    limit,
    completenessPercent: (completeness * 100).toFixed(1),
    unit: CPCB_NAAQS_2009[pollutant].unit
  };
}
```

### 5.2 CPCB AQI Piecewise Interpolator (`aqiCalculator.js`)

```javascript
const AQI_BREAKPOINTS = {
  PM25: [
    { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
    { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
    { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
    { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
    { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
    { cLow: 250, cHigh: 500, iLow: 401, iHigh: 500 }
  ],
  PM10: [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
    { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
    { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
    { cLow: 430, cHigh: 600, iLow: 401, iHigh: 500 }
  ]
  // Additional breakpoints for SO2, NO2, CO, O3 according to CPCB 2014 manual
};

export function calculateSubIndex(concentration, pollutant) {
  const table = AQI_BREAKPOINTS[pollutant];
  if (!table) return null;
  for (const bp of table) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return Math.round(((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow);
    }
  }
  return concentration > 500 ? 500 : 0;
}
```

---

## 6. Gemini AI Advisory Pipeline & Safety Wrappers

### 6.1 Prompt Pipeline Specification
To guarantee consistent, secure, and structured outputs, the system calls Gemini using explicit JSON schema framing and robust system instructions:

```javascript
export async function generateIncidentTriageAdvisory(incidentDossier) {
  const prompt = `
You are the EcoSentinel AI Technical Incident Intelligence Advisor.
Analyze the following civic/environmental incident and generate an objective operational advisory:

Incident Context:
- Code: ${incidentDossier.tracking_code}
- Category: ${incidentDossier.category_name} (${incidentDossier.incident_type})
- Location: ${incidentDossier.address} (${incidentDossier.latitude}, ${incidentDossier.longitude})
- Current Severity: ${incidentDossier.severity}
- Citizen/Field Description: "${incidentDossier.description}"

Produce a structured JSON response with the following keys:
1. "risk_assessment": Objective evaluation of environmental and public safety hazards.
2. "immediate_actions": Array of 3 sequential operational steps for field responders.
3. "recommended_resources": Array of technical equipment or specialized teams needed.
4. "preventive_capa": Suggested long-term preventive measures.
5. "confidence_score": Float between 0.0 and 1.0.

Ensure your advice is strictly technical and operational. Do not use speculative language.
`;

  const response = await geminiClient.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  });

  const parsed = JSON.parse(response.text());
  
  // Mandatory Safety Disclaimer Wrapper
  parsed.disclaimer = "ADVISORY NOTICE: Recommendations generated by EcoSentinel AI Copilot are technical suggestions for decision-support. They do not constitute official statutory compliance determinations, legal certifications, or government emergency dispatch orders.";
  
  return parsed;
}
```

---

## 7. Security, Environment & Secrets Isolation

1. **Secret Storage:** All cloud keys (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are maintained exclusively in `BACKEND/.env` and excluded from source control.
2. **CORS Policy:** Backend CORS explicitly configured to whitelist `http://localhost:5173` (Vite dev server) with disallowed wildcard credentials.
3. **Database Security:** Supabase tables configured with appropriate primary keys, foreign key cascading safeguards, and indexes on frequently queried fields (`status`, `severity`, `category_id`, `station_id`).
