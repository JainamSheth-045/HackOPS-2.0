# EcoSentinel AI - Product Requirements Document (PRD)

**Project Name:** EcoSentinel AI  
**Sub-title:** Environmental Intelligence & Statutory Compliance Management Platform  
**Target Milestone:** Hackathon MVP (Single Developer Track)  
**Primary Domain:** Ambient Air Quality Monitoring & CPCB Regulatory Compliance  
**Regulatory Baseline:** Central Pollution Control Board (CPCB) NAAQS 2009 & National AQI 2014  
**Author:** EcoSentinel AI Engineering Team  

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
Industrial zones, manufacturing clusters, and regional compliance officers across India face significant friction in environmental compliance:
1. **Confusion Between Statutory Limits (NAAQS) and Public Communication (AQI):** Field engineers and plant operators often conflate the public **Air Quality Index (AQI)** (a 0–500 health risk scale) with the legally binding **National Ambient Air Quality Standards (NAAQS)** (notified under the Air Act, 1981). A plant may operate within an "AQI Moderate" zone while in actual statutory violation of a 24-hour standard, or vice-versa.
2. **Complex Statutory Averaging Criteria:** CPCB NAAQS mandates distinct statutory averaging intervals (24-hour for $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{SO}_2$, $\text{NO}_2$; 8-hour and 1-hour for $\text{CO}$ and $\text{O}_3$; and Annual averages). Ad-hoc manual monitoring fails to track these discrete windows or meet minimum data completeness criteria ($75\%$ valid data capture).
3. **Data Integrity & Simulation Transparency:** Environmental demo systems often obscure data provenance, blurring lines between simulated test streams and verified physical station feeds.
4. **Lack of Actionable Root-Cause Guidance:** Traditional telemetry triggers basic alarms but fails to provide operational guidance (e.g., wet scrubber liquor balance, baghouse differential pressure, burner air-fuel ratio) or structured Corrective and Preventive Actions (CAPA).

### 1.2 Proposed Solution
**EcoSentinel AI** is an intelligent, full-stack compliance management platform engineered for Environmental Health & Safety (EHS) managers, plant operators, and environmental auditors. EcoSentinel AI provides:
* **Real-time Ambient Telemetry Visualization:** Live monitoring with strict data-origin labeling (`[SIMULATED DATA]` vs `[VERIFIED MONITORING]`).
* **Automated CPCB NAAQS Compliance Engine:** Discrete and operational averaging checks against official CPCB 2009 Gazette standards.
* **Dual Compliance Status Display:** Side-by-side visualization distinguishing **Statutory Legal Compliance (Pass/Breach)** from **Public Health AQI (Good to Severe)**.
* **Internal Anomaly & Trend Forecasting:** Operational spike detection heuristics and linear trend lookaheads for proactive emission controls.
* **Gemini-Powered Compliance Copilot:** Automated advisory reports and mitigation checklists (strictly labeled as non-binding technical advice).
* **Incident Lifecycle Management:** End-to-end incident ticketing from detection to CAPA resolution.

---

## 2. Official Regulatory References & Authority Sources

EcoSentinel AI is grounded in official Indian statutory frameworks:
1. **CPCB National Ambient Air Quality Standards (NAAQS):** Gazette of India, Extraordinary, Notification No. B-29016/20/90/PCI-L, November 18, 2009.  
   *Official Link:* [CPCB Air Quality Standards](https://cpcb.nic.in/air-quality-standards/)
2. **CPCB National Air Quality Index (AQI) Technical Manual:** Central Pollution Control Board, Ministry of Environment, Forest and Climate Change (MoEF&CC), October 2014.  
   *Official Link:* [CPCB National AQI Portal](https://cpcb.nic.in/National-Air-Quality-Index/)
3. **The Air (Prevention and Control of Pollution) Act, 1981:** Statutory mandate governing emission compliance and state/central enforcement.  
   *Official Link:* [Central Pollution Control Board Act Reference](https://cpcb.nic.in)
4. **National Clean Air Programme (PRANA Portal):** Portal for Regulation of Air-pollution in Non-Attainment cities.  
   *Official Link:* [PRANA Portal](https://prana.cpcb.gov.in/)
5. **Central Continuous Ambient Air Quality Monitoring (CAAQMS) Network:** Real-time continuous station network.  
   *Official Link:* [CPCB CAAQMS Portal](https://app.cpcbccr.com/ccr/)

---

## 3. Statutory NAAQS Compliance vs. Public AQI

The system enforces a clear programmatic and visual separation between statutory legal compliance and public health index communication:

| Dimension | CPCB NAAQS Statutory Compliance | CPCB National AQI |
| :--- | :--- | :--- |
| **Legal Basis** | Notified under Air Act (1981) Section 16(2)(h). | Public health advisory index (MoEF&CC / CPCB, 2014). |
| **Output Type** | **Binary / Statutory:** `COMPLIANT` vs `STATUTORY BREACH`. | **Ordinal Health Score:** $0 - 500$ across 6 colored bands. |
| **Averaging Windows** | Exact statutory periods: 24-hr ($\text{PM}_{2.5}, \text{PM}_{10}, \text{SO}_2, \text{NO}_2$), 8-hr & 1-hr ($\text{CO}, \text{O}_3$), Annual. | Pollutant-specific windows aggregated into max sub-index ($I_{\text{max}}$). |
| **Data Requirement** | Requires valid sampling capture (minimum $75\%$ or 16 hours of valid data for 24-hr mean). | Requires at least 3 pollutants with at least one particulate parameter ($\text{PM}_{2.5}$ or $\text{PM}_{10}$). |
| **Consequence of Exceedance** | Triggers regulatory liability, show-cause notices, or operational inspection orders. | Alerts public regarding outdoor activity, sensitive health precautions, and air purifying recommendations. |

---

## 4. Target Users & Personas

| Persona | Role | Primary Goals | Key Pain Points |
| :--- | :--- | :--- | :--- |
| **Industrial EHS Manager** | Plant Environmental Safety Lead | Ensure zero statutory breaches, audit operational emission trends, manage CAPA workflows. | Alert fatigue, manual logbooks, fear of regulatory notices under the Air Act. |
| **Plant Operations Engineer** | Shift Supervisor / Utility Lead | Monitor operational limits, regulate scrubbers and bag filters, resolve open incident tickets. | Lacks immediate root-cause diagnosis when particulate or gaseous parameters surge. |
| **Environmental Auditor** | Regulatory / Third-party Green Auditor | Audit compliance records, inspect data capture completeness, review corrective action resolution. | Tedious manual log reconciliation, lack of standardized incident audit trails. |

---

## 5. Scope Definition & Single-Developer Hackathon Feasibility

### 5.1 In-Scope (Hackathon MVP)
* **Air Pollution Focus:** 6 core ambient pollutants:
  * Fine Particulates: $\text{PM}_{2.5}$ ($24\text{-hr}$, $\mu\text{g}/\text{m}^3$)
  * Coarse Particulates: $\text{PM}_{10}$ ($24\text{-hr}$, $\mu\text{g}/\text{m}^3$)
  * Sulphur Dioxide: $\text{SO}_2$ ($24\text{-hr}$, $\mu\text{g}/\text{m}^3$)
  * Nitrogen Dioxide: $\text{NO}_2$ ($24\text{-hr}$, $\mu\text{g}/\text{m}^3$)
  * Carbon Monoxide: $\text{CO}$ ($8\text{-hr}$ and $1\text{-hr}$, $\text{mg}/\text{m}^3$)
  * Ground-level Ozone: $\text{O}_3$ ($8\text{-hr}$ and $1\text{-hr}$, $\mu\text{g}/\text{m}^3$)
* **Compliance Checks (MVP):** Short-term statutory standards ($24\text{-hr}$, $8\text{-hr}$, and $1\text{-hr}$) evaluated via discrete calculation windows and operational rolling monitors.
* **Simulated Telemetry:** Synthetic data streams clearly labeled as `[SIMULATED DATA]` with configurable scenarios (normal operations, gradual build-up, sudden spike).
* **Incident & CAPA Tracking:** Incident generation, severity ratings, assignment, and status lifecycle.
* **Gemini Advisory Copilot:** Structured prompt pipeline delivering technical root-cause hypotheses and CAPA checklists with mandatory non-regulatory disclaimers.

### 5.2 Future Scope (Post-MVP)
* **Annual NAAQS Compliance Assessment:** Requires arithmetic mean of minimum 104 measurements in a year (twice a week 24-hourly at uniform intervals). Postponed due to lack of historical year-long datasets in hackathon demo mode.
* **Toxic Trace Pollutants:** Ammonia ($\text{NH}_3$), Lead ($\text{Pb}$), Nickel ($\text{Ni}$), Arsenic ($\text{As}$), Benzene ($\text{C}_6\text{H}_6$), Benzo(a)pyrene ($\text{BaP}$).
* **Effluent & Solid Waste:** Industrial wastewater parameters (pH, BOD, COD, TSS) and hazardous waste manifest tracking.
* **Automated Regulatory Filing:** Direct webhook/API integration with State Pollution Control Board (SPCB) online portals.

---

## 6. High-Level Core Features

```
+-----------------------------------------------------------------------------------+
|                                 EcoSentinel AI                                    |
+-----------------------------------------------------------------------------------+
|  1. Real-time Ambient Telemetry   |  2. Statutory CPCB Compliance Engine          |
|     - PM2.5, PM10, SO2, NO2       |     - Exact 24-hr, 8-hr, 1-hr NAAQS Limits    |
|     - CO, O3 (8h & 1h standards)  |     - Discrete & Operational Rolling Windows  |
|     - Provenance: [SIMULATED]     |     - Binary Legal Compliance: Pass / Breach  |
+-----------------------------------+-----------------------------------------------+
|  3. Internal Anomaly & Forecast   |  4. Incident & CAPA Management                |
|     - Demo Heuristic: ≥40% in 15m |     - Breach-to-Incident Auto-generation      |
|     - Trend Lookahead (6h - 24h)  |     - Action Items, Assignee, Deadlines       |
|     - Estimated Time-to-Breach    |     - Status: Open -> Review -> Mitigated     |
+-----------------------------------+-----------------------------------------------+
|                      5. Gemini AI Compliance Copilot                              |
|     - Contextual Root-Cause Hypotheses & Engineering Controls                     |
|     - Step-by-Step Mitigation Checklist (Advisory Only - Non-regulatory)          |
+-----------------------------------------------------------------------------------+
```

---

## 7. MVP Execution Roadmap

* **Sprint 1: System Baseline & Schema Initialization** (Documentation review, Supabase tables, seed scripts).
* **Sprint 2: Backend Rule Engine & Telemetry Simulator** (NAAQS limits, AQI calculator, discrete window aggregator, Express APIs).
* **Sprint 3: Frontend Dashboard & Recharts** (Station switcher, dual-status indicators, time-series charts with statutory threshold lines).
* **Sprint 4: Gemini Advisory & Incident Lifecycle** (Structured AI prompt pipeline, incident ticket management, CAPA workflow).
* **Sprint 5: End-to-End Verification & Polish** (UI polish, simulated scenarios testing, hackathon demo dry-run).
