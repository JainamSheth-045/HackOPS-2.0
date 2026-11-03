# EcoSentinel AI - Unified Environmental & Incident Intelligence Platform

Welcome to the documentation suite for **EcoSentinel AI**, an enterprise-grade Unified Environmental & Incident Intelligence Platform.

## Platform Vision & Expanded Scope
EcoSentinel AI unifies continuous environmental monitoring with rapid incident management and AI-assisted emergency intelligence across four critical domains:
1. **Environmental Pollution:** Ambient air quality (CPCB NAAQS 2009 statutory compliance), water effluent, soil contamination, noise pollution, chemical leaks, oil spills, and hazardous waste dumping.
2. **Natural Disasters:** Floods, urban waterlogging, earthquakes, landslides, cyclones, severe storms, heatwaves, wildfires, and droughts.
3. **Accidents & Emergencies:** Industrial explosions, building fires, hazardous gas leaks, road collisions, structural collapses, electrical hazards, and workplace casualties.
4. **Public Infrastructure:** Damaged roadways, major potholes, sewer overflows, blocked stormwater drainage, fallen trees, and drinking water supply disruptions.

---

## Documentation Architecture

```text
DOCUMENTATION/
├── README.md                 <-- Suite overview, scope boundaries & navigation guide
├── PRD.md                    <-- Product Requirements: Problem statement, 4 incident domains, 7 core modules, user personas & roadmap
├── DRD.md                    <-- Detailed Requirements: Functional rules, CPCB air standards, 7-stage incident lifecycle, AI boundaries
├── TECHNICAL_DESIGN.md       <-- System Design: React 19 + Express + Supabase + Gemini + Leaflet solo-developer architecture
└── DATABASE_SCHEMA.md        <-- Unified PostgreSQL Schema: 10 relational tables, DDLs, ERD, indexes & comprehensive seed data
```

---

## Directory Overview

* **[PRD.md](file:///c:/Users/JAINAM%20SHETH/Desktop/Hackops%202.0/DOCUMENTATION/PRD.md):** High-level product definition covering the multi-domain incident expansion, 7 web modules (Global Dashboard, Report an Incident, AI Incident Intelligence, Environmental Compliance, Incident Management, Global Incident Map, Settings), user journeys, and MVP vs Future Scope.
* **[DRD.md](file:///c:/Users/JAINAM%20SHETH/Desktop/Hackops%202.0/DOCUMENTATION/DRD.md):** Granular functional specifications for all 4 incident categories, the 7-stage lifecycle (`Submitted` → `Under Review` → `Verified` → `Assigned` → `In Progress` → `Resolved` → `Closed`, with `Rejected`), statutory CPCB NAAQS averaging rules, and human-in-the-loop AI boundaries.
* **[TECHNICAL_DESIGN.md](file:///c:/Users/JAINAM%20SHETH/Desktop/Hackops%202.0/DOCUMENTATION/TECHNICAL_DESIGN.md):** End-to-end full-stack design covering client routes, Leaflet map architecture, Express controller hierarchy, Gemini advisory prompt templates, and security isolation.
* **[DATABASE_SCHEMA.md](file:///c:/Users/JAINAM%20SHETH/Desktop/Hackops%202.0/DOCUMENTATION/DATABASE_SCHEMA.md):** Detailed Supabase PostgreSQL specifications for 10 unified tables (`incident_categories`, `locations`, `incidents`, `incident_evidence`, `incident_updates`, `incident_assignments`, `corrective_actions`, `monitoring_stations`, `pollution_readings`, `compliance_assessments`).
