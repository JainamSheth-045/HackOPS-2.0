-- ==============================================================================
-- EcoSentinel AI - Initial Database Migration (001_initial_schema.sql)
-- Target Platform: Supabase PostgreSQL (Postgres 15+)
-- Description: Hardened Unified Multi-Domain Environmental & Incident Intelligence Schema
-- Author: EcoSentinel AI Engineering Team
-- ==============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. REGULATORY STANDARDS & REFERENCE TABLES
-- ==============================================================================

-- 1.1 Incident Categories Table
-- Defines the four operational incident domains
CREATE TABLE IF NOT EXISTS incident_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 Regulatory Standards Table (Authoritative Statutory Lookup)
-- Dynamic registry for CPCB NAAQS 2009 Gazette standards and threshold limits
CREATE TABLE IF NOT EXISTS regulatory_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pollutant VARCHAR(30) NOT NULL,
    chemical_formula VARCHAR(20) NOT NULL,
    averaging_period VARCHAR(20) NOT NULL CHECK (averaging_period IN ('24h', '8h', '1h', 'Annual')),
    standard_limit NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    area_type VARCHAR(50) NOT NULL DEFAULT 'Industrial_Residential_Rural',
    regulatory_reference VARCHAR(255) NOT NULL DEFAULT 'CPCB NAAQS Notification No. B-29016/20/90/PCI-L (2009)',
    is_mvp_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_regulatory_standard UNIQUE (pollutant, averaging_period, area_type)
);

-- 1.3 Locations Table
-- Geographic registry for industrial clusters, monitoring zones, and civic sectors
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    area_type VARCHAR(50) NOT NULL DEFAULT 'Industrial' CHECK (area_type IN ('Industrial', 'Residential', 'Ecologically_Sensitive', 'Commercial')),
    is_industrial_cluster BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. ENVIRONMENTAL TELEMETRY INFRASTRUCTURE
-- ==============================================================================

-- 2.1 Monitoring Stations Table
-- Continuous Ambient Air Quality Monitoring Stations (CAAQMS)
CREATE TABLE IF NOT EXISTS monitoring_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    station_type VARCHAR(50) NOT NULL DEFAULT 'Industrial' CHECK (station_type IN ('Industrial', 'Commercial', 'Residential', 'Ecologically_Sensitive')),
    status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Offline')),
    data_origin VARCHAR(50) NOT NULL DEFAULT 'SIMULATED' CHECK (data_origin IN ('SIMULATED', 'VERIFIED_MONITORING')),
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. UNIFIED MULTI-DOMAIN INCIDENTS CORE
-- ==============================================================================

-- 3.1 Incidents Table
-- Central repository for Environmental, Disaster, Emergency, and Infrastructure reports
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(30) NOT NULL UNIQUE,
    category_id UUID NOT NULL REFERENCES incident_categories(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN (
        'Submitted', 'Under Review', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'
    )),
    description TEXT NOT NULL,
    reporter_name VARCHAR(120),
    reporter_contact VARCHAR(100),
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 3.2 Incident Evidence Table
-- Photo and document captures for submitted incidents
CREATE TABLE IF NOT EXISTS incident_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes INTEGER,
    caption TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.3 Incident Updates Table
-- Chronological internal audit trail for 7-stage state transitions
CREATE TABLE IF NOT EXISTS incident_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL CHECK (new_status IN (
        'Submitted', 'Under Review', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'
    )),
    comment TEXT NOT NULL,
    updated_by_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Incident Assignments Table
-- Departmental dispatch and field response coordination
CREATE TABLE IF NOT EXISTS incident_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    assigned_department VARCHAR(150) NOT NULL,
    assigned_to_name VARCHAR(120),
    priority VARCHAR(20) NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent', 'Immediate')),
    notes TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    target_completion_time TIMESTAMPTZ
);

-- 3.5 Corrective Actions Table
-- Formal Corrective and Preventive Actions (CAPA) tracking
CREATE TABLE IF NOT EXISTS corrective_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    action_description TEXT NOT NULL,
    action_type VARCHAR(50) NOT NULL DEFAULT 'Corrective' CHECK (action_type IN ('Corrective', 'Preventive', 'Engineering', 'Civic')),
    assigned_to VARCHAR(120) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed', 'Verified')),
    target_date DATE NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. TELEMETRY READINGS & STATUTORY ASSESSMENTS
-- ==============================================================================

-- 4.1 Pollution Readings Table
-- Discrete time-series air quality telemetry with explicit provenance
CREATE TABLE IF NOT EXISTS pollution_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES monitoring_stations(id) ON DELETE CASCADE,
    incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL, -- Nullable link if telemetry triggered an incident
    pm25 NUMERIC(6, 2),
    pm10 NUMERIC(6, 2),
    so2 NUMERIC(6, 2),
    no2 NUMERIC(6, 2),
    co NUMERIC(6, 2),
    o3 NUMERIC(6, 2),
    aqi_score INTEGER,
    aqi_category VARCHAR(30) CHECK (aqi_category IN ('Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe')),
    prominent_pollutant VARCHAR(20),
    data_origin VARCHAR(50) NOT NULL DEFAULT 'SIMULATED' CHECK (data_origin IN ('SIMULATED', 'VERIFIED_MONITORING')),
    is_simulated BOOLEAN NOT NULL DEFAULT true,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2 Compliance Assessments Table
-- Formal evaluations of telemetry against statutory CPCB NAAQS limits
CREATE TABLE IF NOT EXISTS compliance_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES monitoring_stations(id) ON DELETE CASCADE,
    incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL, -- Link to breach incident if non-compliant
    standard_id UUID REFERENCES regulatory_standards(id) ON DELETE RESTRICT, -- Foreign key to statutory limit
    pollutant VARCHAR(30) NOT NULL,
    averaging_period VARCHAR(20) NOT NULL CHECK (averaging_period IN ('24h', '8h', '1h', 'Annual')),
    standard_limit NUMERIC(10, 2) NOT NULL,
    calculated_value NUMERIC(10, 2) NOT NULL,
    data_completeness_pct NUMERIC(5, 2) NOT NULL,
    compliance_status VARCHAR(40) NOT NULL CHECK (compliance_status IN ('COMPLIANT', 'STATUTORY_BREACH', 'INSUFFICIENT_DATA_CAPTURE')),
    assessment_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. PERFORMANCE & SEARCH INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_incidents_category_id ON incidents(category_id);
CREATE INDEX IF NOT EXISTS idx_incidents_location_id ON incidents(location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_tracking_code ON incidents(tracking_code);

CREATE INDEX IF NOT EXISTS idx_evidence_incident_id ON incident_evidence(incident_id);
CREATE INDEX IF NOT EXISTS idx_updates_incident_id ON incident_updates(incident_id);
CREATE INDEX IF NOT EXISTS idx_assignments_incident_id ON incident_assignments(incident_id);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_incident_id ON corrective_actions(incident_id);
CREATE INDEX IF NOT EXISTS idx_corrective_actions_status ON corrective_actions(status);

CREATE INDEX IF NOT EXISTS idx_stations_code ON monitoring_stations(code);
CREATE INDEX IF NOT EXISTS idx_stations_location_id ON monitoring_stations(location_id);
CREATE INDEX IF NOT EXISTS idx_readings_station_recorded ON pollution_readings(station_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_station_time ON compliance_assessments(station_id, assessment_time DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_standard_id ON compliance_assessments(standard_id);

-- ==============================================================================
-- 6. SAFE PUBLIC INCIDENT VIEW (SECURITY PROJECTION)
-- PostgreSQL 15+ View with security_invoker = true.
-- Projects non-sensitive incident fields joined with category and location names.
-- Completely excludes reporter personal identifiers (reporter_name, reporter_contact).
-- Uses safe DROP VIEW (without CASCADE) to avoid silently deleting dependent objects.
-- ==============================================================================

DROP VIEW IF EXISTS public_incidents;

CREATE VIEW public_incidents 
WITH (security_invoker = true) AS
SELECT 
    i.id,
    i.tracking_code,
    i.category_id,
    c.name AS category_name,
    c.code AS category_code,
    c.icon_name AS category_icon,
    i.location_id,
    l.name AS location_name,
    l.state AS location_state,
    l.district AS location_district,
    i.incident_type,
    i.latitude,
    i.longitude,
    i.address,
    i.severity,
    i.status,
    i.description,
    i.is_simulated,
    i.created_at,
    i.updated_at,
    i.resolved_at
FROM incidents i
LEFT JOIN incident_categories c ON i.category_id = c.id
LEFT JOIN locations l ON i.location_id = l.id;

-- ==============================================================================
-- 7. COLUMN PRIVILEGES & ACCESS GRANTS
-- ==============================================================================

-- 7.1 View Permissions
GRANT SELECT ON public_incidents TO anon, authenticated;

-- 7.2 Incidents Column Privileges
-- Revoke table-level privileges from anon and authenticated to enforce column-level PII protection
REVOKE ALL ON incidents FROM anon, authenticated;

-- Grant SELECT ONLY on non-sensitive columns to anon and ordinary authenticated users (reporter PII excluded)
GRANT SELECT (
    id, tracking_code, category_id, location_id, incident_type,
    latitude, longitude, address, severity, status, description,
    is_simulated, created_at, updated_at, resolved_at
) ON incidents TO anon, authenticated;

-- Grant INSERT permissions including 'id' so community users and client libraries can report
GRANT INSERT (
    id, tracking_code, category_id, location_id, incident_type,
    latitude, longitude, address, severity, status, description,
    reporter_name, reporter_contact, is_simulated
) ON incidents TO anon, authenticated;

-- Grant UPDATE and DELETE to authenticated (RLS restricts execution strictly to public.is_staff())
GRANT UPDATE, DELETE ON incidents TO authenticated;

-- 7.3 Incident Evidence Column Privileges
REVOKE ALL ON incident_evidence FROM anon;
GRANT INSERT (
    id, incident_id, file_url, file_type, file_size_bytes, caption, is_simulated
) ON incident_evidence TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON incident_evidence TO authenticated;

-- 7.4 Reference & Telemetry Table Permissions
GRANT SELECT ON incident_categories TO anon, authenticated;
GRANT SELECT ON regulatory_standards TO anon, authenticated;
GRANT SELECT ON locations TO anon, authenticated;
GRANT SELECT ON monitoring_stations TO anon, authenticated;
GRANT SELECT ON pollution_readings TO anon, authenticated;
GRANT SELECT ON compliance_assessments TO anon, authenticated;

-- Internal audit tables are completely inaccessible to anon
REVOKE ALL ON incident_updates FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON incident_updates TO authenticated;

REVOKE ALL ON incident_assignments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON incident_assignments TO authenticated;

REVOKE ALL ON corrective_actions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON corrective_actions TO authenticated;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 8.1 Hardened Staff Verification Helper Function
-- Secured with search_path = '', SECURITY DEFINER, and safe string parsing (no cast exceptions).
-- In Supabase Auth, staff verification is governed by auth.users.app_metadata.
-- Standard authenticated users (public community members with an account) return FALSE.
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'is_staff') IN ('true', 't', '1'),
      false
    )
    OR
    COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'role') IN ('staff', 'admin', 'ehs_officer', 'dispatcher'),
      false
    );
$$;

-- Secure function execution privileges
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_staff() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

-- 8.2 Safe Staff Incident View (Full Dossier with PII for Verified Personnel Only)
-- View owned by postgres; filters with WHERE public.is_staff().
-- Non-staff receive 0 rows. Verified staff can inspect full dossiers including reporter details.
DROP VIEW IF EXISTS staff_incidents;

CREATE VIEW staff_incidents
WITH (security_barrier = true) AS
SELECT * FROM incidents
WHERE public.is_staff();

ALTER VIEW staff_incidents OWNER TO postgres;

GRANT SELECT ON staff_incidents TO authenticated;

-- Enable RLS across all 11 tables
ALTER TABLE incident_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollution_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_assessments ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8.2 Drop All Policies Safely (Ensures migration is idempotently repeatable)
-- Comprehensive list covering all current and previous policy names
-- ------------------------------------------------------------------------------

-- Reference & Telemetry Tables
DROP POLICY IF EXISTS "Public Read incident_categories" ON incident_categories;
DROP POLICY IF EXISTS "Authenticated users manage categories" ON incident_categories;

DROP POLICY IF EXISTS "Public Read regulatory_standards" ON regulatory_standards;
DROP POLICY IF EXISTS "Authenticated users manage regulatory standards" ON regulatory_standards;

DROP POLICY IF EXISTS "Public Read locations" ON locations;
DROP POLICY IF EXISTS "Authenticated users manage locations" ON locations;

DROP POLICY IF EXISTS "Public Read monitoring_stations" ON monitoring_stations;
DROP POLICY IF EXISTS "Authenticated users manage stations" ON monitoring_stations;

DROP POLICY IF EXISTS "Public Read pollution_readings" ON pollution_readings;
DROP POLICY IF EXISTS "Authenticated telemetry ingestion" ON pollution_readings;

DROP POLICY IF EXISTS "Public Read compliance_assessments" ON compliance_assessments;
DROP POLICY IF EXISTS "Authenticated compliance logging" ON compliance_assessments;

-- Incidents Policies
DROP POLICY IF EXISTS "Allow incident creation" ON incidents;
DROP POLICY IF EXISTS "Allow public incident creation" ON incidents;
DROP POLICY IF EXISTS "Public read non-sensitive incident rows" ON incidents;
DROP POLICY IF EXISTS "Authenticated users view full incidents" ON incidents;
DROP POLICY IF EXISTS "Staff update incidents" ON incidents;
DROP POLICY IF EXISTS "Authenticated users update incidents" ON incidents;
DROP POLICY IF EXISTS "Staff delete incidents" ON incidents;
DROP POLICY IF EXISTS "Authenticated users delete incidents" ON incidents;

-- Incident Evidence Policies
DROP POLICY IF EXISTS "Allow public evidence attachment to submitted incidents" ON incident_evidence;
DROP POLICY IF EXISTS "Allow authenticated evidence attachment" ON incident_evidence;
DROP POLICY IF EXISTS "Staff view evidence" ON incident_evidence;
DROP POLICY IF EXISTS "Authenticated users view evidence" ON incident_evidence;
DROP POLICY IF EXISTS "Staff update evidence" ON incident_evidence;
DROP POLICY IF EXISTS "Authenticated users update evidence" ON incident_evidence;
DROP POLICY IF EXISTS "Staff delete evidence" ON incident_evidence;
DROP POLICY IF EXISTS "Authenticated users delete evidence" ON incident_evidence;

-- Incident Updates Policies
DROP POLICY IF EXISTS "Staff view incident updates" ON incident_updates;
DROP POLICY IF EXISTS "Authenticated users view incident updates" ON incident_updates;
DROP POLICY IF EXISTS "Staff insert incident updates" ON incident_updates;
DROP POLICY IF EXISTS "Authenticated users insert incident updates" ON incident_updates;

-- Incident Assignments Policies
DROP POLICY IF EXISTS "Staff view assignments" ON incident_assignments;
DROP POLICY IF EXISTS "Authenticated users view assignments" ON incident_assignments;
DROP POLICY IF EXISTS "Staff manage assignments" ON incident_assignments;
DROP POLICY IF EXISTS "Authenticated users manage assignments" ON incident_assignments;

-- Corrective Actions Policies
DROP POLICY IF EXISTS "Staff view corrective actions" ON corrective_actions;
DROP POLICY IF EXISTS "Authenticated users view corrective actions" ON corrective_actions;
DROP POLICY IF EXISTS "Staff manage corrective actions" ON corrective_actions;
DROP POLICY IF EXISTS "Authenticated users manage corrective actions" ON corrective_actions;

-- ------------------------------------------------------------------------------
-- 8.3 Public Read Policies: Reference Master Data & Ambient Telemetry
-- Reference standards and ambient telemetry are public, non-PII records
-- ------------------------------------------------------------------------------

CREATE POLICY "Public Read incident_categories" ON incident_categories 
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read regulatory_standards" ON regulatory_standards 
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read locations" ON locations 
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read monitoring_stations" ON monitoring_stations 
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read pollution_readings" ON pollution_readings 
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public Read compliance_assessments" ON compliance_assessments 
    FOR SELECT TO anon, authenticated USING (true);

-- ------------------------------------------------------------------------------
-- 8.4 Incidents RLS Policies: Public Submissions & Verified Staff Operations
-- 1. Anonymous and authenticated users can view incident rows, but anon is
--    restricted by column privileges from reading reporter_name/reporter_contact.
-- 2. All incoming community/user incidents MUST start with status = 'Submitted'.
-- 3. Only verified staff (public.is_staff() = true) can UPDATE status or DELETE incidents.
-- ------------------------------------------------------------------------------

CREATE POLICY "Public read non-sensitive incident rows" ON incidents 
    FOR SELECT TO anon, authenticated 
    USING (true);

CREATE POLICY "Allow incident creation" ON incidents 
    FOR INSERT TO anon, authenticated 
    WITH CHECK (status = 'Submitted');

CREATE POLICY "Staff update incidents" ON incidents 
    FOR UPDATE TO authenticated 
    USING (public.is_staff()) 
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff delete incidents" ON incidents 
    FOR DELETE TO authenticated 
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 8.5 Incident Evidence RLS Policies
-- 1. Anonymous users can attach evidence ONLY when incident exists and has status 'Submitted'.
-- 2. Authenticated non-staff can also attach evidence ONLY to 'Submitted' incidents.
--    Verified staff (is_staff() = true) can attach evidence to any valid incident.
-- 3. Anonymous users and regular users CANNOT SELECT evidence URLs.
-- 4. Only verified staff can view, update, or delete evidence records.
-- ------------------------------------------------------------------------------

CREATE POLICY "Allow public evidence attachment to submitted incidents" ON incident_evidence 
    FOR INSERT TO anon 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM incidents
            WHERE incidents.id = incident_evidence.incident_id
              AND incidents.status = 'Submitted'
        )
    );

CREATE POLICY "Allow authenticated evidence attachment" ON incident_evidence 
    FOR INSERT TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM incidents
            WHERE incidents.id = incident_evidence.incident_id
              AND (
                  incidents.status = 'Submitted'
                  OR public.is_staff()
              )
        )
    );

CREATE POLICY "Staff view evidence" ON incident_evidence 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

CREATE POLICY "Staff update evidence" ON incident_evidence 
    FOR UPDATE TO authenticated 
    USING (public.is_staff()) 
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff delete evidence" ON incident_evidence 
    FOR DELETE TO authenticated 
    USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 8.6 Internal Audit Trail, Dispatch Assignments & CAPA (Verified Staff Only)
-- Anonymous callers and regular authenticated citizens have ZERO access.
-- Operations are restricted strictly to users with verified staff claims.
-- ------------------------------------------------------------------------------

CREATE POLICY "Staff view incident updates" ON incident_updates 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

CREATE POLICY "Staff insert incident updates" ON incident_updates 
    FOR INSERT TO authenticated 
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff view assignments" ON incident_assignments 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

CREATE POLICY "Staff manage assignments" ON incident_assignments 
    FOR ALL TO authenticated 
    USING (public.is_staff()) 
    WITH CHECK (public.is_staff());

CREATE POLICY "Staff view corrective actions" ON corrective_actions 
    FOR SELECT TO authenticated 
    USING (public.is_staff());

CREATE POLICY "Staff manage corrective actions" ON corrective_actions 
    FOR ALL TO authenticated 
    USING (public.is_staff()) 
    WITH CHECK (public.is_staff());

-- ------------------------------------------------------------------------------
-- 8.7 Architectural Note on Role Authorization & Service Role
-- In this schema:
-- 1. Public ('anon'): Can read reference data, query public_incidents,
--    and submit new incidents/evidence with status = 'Submitted'.
-- 2. Standard Authenticated ('authenticated'): Treated as community reporters.
--    Can submit new incidents and evidence with status = 'Submitted'. Cannot read
--    internal dispatch, audit logs, or reporter personal contacts.
-- 3. Verified Staff ('is_staff() = true'): Users with role = 'staff' or is_staff = true
--    in auth.users.app_metadata. Can review full dossiers, update statuses,
--    manage dispatches, and track CAPA.
-- 4. Privileged Ingestion ('service_role'): Background telemetry ingestion,
--    statutory compliance evaluations, and automated tasks run via Express backend
--    using SUPABASE_SERVICE_ROLE_KEY, which safely bypasses RLS.
-- ------------------------------------------------------------------------------

-- ==============================================================================
-- 9. COMPREHENSIVE REPEATABLE SEED DATA
-- All seed records use explicit deterministic UUIDs and ON CONFLICT (id) DO NOTHING
-- so re-running the migration will never create duplicate rows.
-- ==============================================================================

-- 9.1 Seed the 4 Core Incident Categories
INSERT INTO incident_categories (id, name, code, description, icon_name, is_active)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Environmental Pollution', 'ENVIRONMENTAL', 'Ambient air breaches, chemical leaks, toxic effluent discharge, and hazardous waste dumping.', 'Leaf', true),
    ('c1000000-0000-0000-0000-000000000002', 'Natural Disasters', 'NATURAL_DISASTER', 'Urban waterlogging, river floods, earthquakes, landslides, severe cyclones, and heatwaves.', 'CloudRain', true),
    ('c1000000-0000-0000-0000-000000000003', 'Accidents & Emergencies', 'ACCIDENT_EMERGENCY', 'Industrial boiler fires, hazardous gas leaks, major road collisions, and structural collapses.', 'Flame', true),
    ('c1000000-0000-0000-0000-000000000004', 'Public Infrastructure', 'INFRASTRUCTURE', 'Severe road craters/potholes, broken stormwater drains, sewage overflows, and fallen trees.', 'Wrench', true)
ON CONFLICT (id) DO NOTHING;

-- 9.2 Seed Official CPCB NAAQS 2009 Standards
INSERT INTO regulatory_standards (id, pollutant, chemical_formula, averaging_period, standard_limit, unit, area_type, is_mvp_active, description)
VALUES
    ('02000000-0000-0000-0000-000000000001', 'PM2.5', 'PM2.5', '24h', 60.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 24-hour limit for fine particulate matter'),
    ('02000000-0000-0000-0000-000000000002', 'PM2.5', 'PM2.5', 'Annual', 40.00, 'µg/m³', 'Industrial_Residential_Rural', false, 'CPCB annual limit (requires >= 104 samples/yr)'),
    ('02000000-0000-0000-0000-000000000003', 'PM10', 'PM10', '24h', 100.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 24-hour limit for respirable particulate matter'),
    ('02000000-0000-0000-0000-000000000004', 'PM10', 'PM10', 'Annual', 60.00, 'µg/m³', 'Industrial_Residential_Rural', false, 'CPCB annual limit (requires >= 104 samples/yr)'),
    ('02000000-0000-0000-0000-000000000005', 'SO2', 'SO2', '24h', 80.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 24-hour limit for Sulphur Dioxide'),
    ('02000000-0000-0000-0000-000000000006', 'SO2', 'SO2', 'Annual', 50.00, 'µg/m³', 'Industrial_Residential_Rural', false, 'CPCB annual limit (requires >= 104 samples/yr)'),
    ('02000000-0000-0000-0000-000000000007', 'NO2', 'NO2', '24h', 80.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 24-hour limit for Nitrogen Dioxide'),
    ('02000000-0000-0000-0000-000000000008', 'NO2', 'NO2', 'Annual', 40.00, 'µg/m³', 'Industrial_Residential_Rural', false, 'CPCB annual limit (requires >= 104 samples/yr)'),
    ('02000000-0000-0000-0000-000000000009', 'CO', 'CO', '8h', 2.00, 'mg/m³', 'Industrial_Residential_Rural', true, 'CPCB 8-hour limit for Carbon Monoxide'),
    ('02000000-0000-0000-0000-000000000010', 'CO', 'CO', '1h', 4.00, 'mg/m³', 'Industrial_Residential_Rural', true, 'CPCB 1-hour limit for Carbon Monoxide'),
    ('02000000-0000-0000-0000-000000000011', 'O3', 'O3', '8h', 100.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 8-hour limit for Ground-level Ozone'),
    ('02000000-0000-0000-0000-000000000012', 'O3', 'O3', '1h', 180.00, 'µg/m³', 'Industrial_Residential_Rural', true, 'CPCB 1-hour limit for Ground-level Ozone')
ON CONFLICT (id) DO NOTHING;

-- 9.3 Seed Demonstration Locations
INSERT INTO locations (id, name, state, district, latitude, longitude, area_type, is_industrial_cluster)
VALUES
    ('03000000-0000-0000-0000-000000000001', 'Vapi GIDC Chemical Estate', 'Gujarat', 'Valsad', 20.3712000, 72.9106000, 'Industrial', true),
    ('03000000-0000-0000-0000-000000000002', 'Manesar IMT Automotive Belt', 'Haryana', 'Gurugram', 28.3518000, 76.9412000, 'Industrial', true),
    ('03000000-0000-0000-0000-000000000003', 'Tarapur MIDC Heavy Engineering', 'Maharashtra', 'Palghar', 19.8080000, 72.6950000, 'Industrial', true),
    ('03000000-0000-0000-0000-000000000004', 'Surat Ring Road Transit Corridor', 'Gujarat', 'Surat', 21.1702000, 72.8311000, 'Residential', false)
ON CONFLICT (id) DO NOTHING;

-- 9.4 Seed CAAQMS Monitoring Stations
INSERT INTO monitoring_stations (id, code, name, location_id, latitude, longitude, station_type, status, data_origin, is_simulated)
VALUES
    ('04000000-0000-0000-0000-000000000001', 'STA-GJ-VAPI-01', 'Vapi GIDC Central CAAQMS', '03000000-0000-0000-0000-000000000001', 20.3712000, 72.9106000, 'Industrial', 'Active', 'SIMULATED', true),
    ('04000000-0000-0000-0000-000000000002', 'STA-HR-MANE-02', 'Manesar IMT East Sector 8', '03000000-0000-0000-0000-000000000002', 28.3518000, 76.9412000, 'Industrial', 'Active', 'SIMULATED', true),
    ('04000000-0000-0000-0000-000000000003', 'STA-MH-TARA-03', 'Tarapur Zone III Monitoring Post', '03000000-0000-0000-0000-000000000003', 19.8080000, 72.6950000, 'Industrial', 'Active', 'SIMULATED', true)
ON CONFLICT (id) DO NOTHING;

-- 9.5 Seed Demonstration Incidents (Covering all 4 domains)
INSERT INTO incidents (id, tracking_code, category_id, location_id, incident_type, latitude, longitude, address, severity, status, description, reporter_name, reporter_contact, is_simulated)
VALUES
    ('05000000-0000-0000-0000-000000000001', 'INC-2026-00101', 'c1000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000001', 'Air Pollution Breach', 20.3712000, 72.9106000, 'Plot 42, Phase II, Vapi GIDC', 'High', 'In Progress', 'Sustained SO2 exceedance reaching 118.5 µg/m³ exceeding statutory 24-hr limit (80 µg/m³).', 'Automated CPCB Engine', 'telemetry-engine@internal', true),
    ('05000000-0000-0000-0000-000000000002', 'INC-2026-00102', 'c1000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000004', 'Urban Waterlogging', 21.1702000, 72.8311000, 'Varachha Main Road, Surat', 'Moderate', 'Verified', 'Severe stormwater waterlogging reaching 2.5 feet obstructing arterial bus transit.', 'Kunal Patel', '+91 98250 11223', true),
    ('05000000-0000-0000-0000-000000000003', 'INC-2026-00103', 'c1000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000003', 'Boiler Fire Incident', 19.8080000, 72.6950000, 'Plant B-4, Tarapur MIDC Zone', 'Critical', 'Assigned', 'Industrial auxiliary boiler ignition with heavy black smoke plume. Evacuation initiated.', 'Shift Engineer Deshmukh', '+91 94220 99881', true),
    ('05000000-0000-0000-0000-000000000004', 'INC-2026-00104', 'c1000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000002', 'Major Roadway Sinkhole', 28.3518000, 76.9412000, 'Expressway Link Road, Sector 8, Manesar', 'Moderate', 'Submitted', 'Large 4-foot deep sinkhole following underground sewer line rupture.', 'Amit Sharma', '+91 98110 55443', true)
ON CONFLICT (id) DO NOTHING;

-- 9.6 Seed Demonstration Incident Updates
INSERT INTO incident_updates (id, incident_id, old_status, new_status, comment, updated_by_name)
VALUES
    ('06000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 'Submitted', 'Under Review', 'Telemetry alarm authenticated against rolling 24-hr average.', 'Officer J. Roy'),
    ('06000000-0000-0000-0000-000000000002', '05000000-0000-0000-0000-000000000001', 'Under Review', 'Verified', 'Continuous exceedance validated at 118.5 µg/m³.', 'Officer J. Roy'),
    ('06000000-0000-0000-0000-000000000003', '05000000-0000-0000-0000-000000000001', 'Verified', 'In Progress', 'Assigned to Chemical Cluster EHS rapid response crew.', 'Dispatcher M. Rao')
ON CONFLICT (id) DO NOTHING;

-- 9.7 Seed Demonstration Incident Assignment
INSERT INTO incident_assignments (id, incident_id, assigned_department, assigned_to_name, priority, notes)
VALUES
    ('a1000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 'Industrial EHS Response Cell', 'Pravin Mehta', 'High', 'Inspect alkali dosing rate in primary wet scrubber unit.')
ON CONFLICT (id) DO NOTHING;

-- 9.8 Seed Demonstration Corrective Action (CAPA)
INSERT INTO corrective_actions (id, incident_id, action_description, action_type, assigned_to, status, target_date, resolution_notes)
VALUES
    ('08000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 'Recalibrate caustic soda scrubbing circulation pump and inspect nozzles', 'Corrective', 'Pravin Mehta', 'In Progress', CURRENT_DATE + 2, 'Spare recirculation pump deployed; nozzle flush underway.')
ON CONFLICT (id) DO NOTHING;

-- 9.9 Seed Demonstration Pollution Reading
-- CPCB 2014 AQI Calculation for this reading:
-- PM2.5 = 78.4 µg/m³ -> Sub-index I_PM2.5 = 160 (Moderate band: 101-200)
-- PM10  = 142.1 µg/m³ -> Sub-index I_PM10  = 128 (Moderate band: 101-200)
-- SO2   = 118.5 µg/m³ -> Sub-index I_SO2   = 113 (Moderate band: 101-200)
-- NO2   = 62.3 µg/m³  -> Sub-index I_NO2   = 78  (Satisfactory band: 51-100)
-- CO    = 1.4 mg/m³   -> Sub-index I_CO    = 67  (Satisfactory band: 51-100)
-- O3    = 45.2 µg/m³  -> Sub-index I_O3    = 45  (Good band: 0-50)
-- Composite AQI = max(160, 128, 113, 78, 67, 45) = 160.
-- Prominent Pollutant = PM2.5. AQI Category = 'Moderate' (101-200).
-- Note: SO2 at 118.5 µg/m³ breaches the statutory 24-hr NAAQS limit (80 µg/m³),
-- which correctly illustrates that an area can be in statutory breach while having an AQI of Moderate.
INSERT INTO pollution_readings (id, station_id, incident_id, pm25, pm10, so2, no2, co, o3, aqi_score, aqi_category, prominent_pollutant, data_origin, is_simulated)
VALUES
    ('09000000-0000-0000-0000-000000000001', '04000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', 78.4, 142.1, 118.5, 62.3, 1.4, 45.2, 160, 'Moderate', 'PM2.5', 'SIMULATED', true)
ON CONFLICT (id) DO NOTHING;

-- 9.10 Seed Demonstration Compliance Assessment
-- Evaluates the SO2 breach at Station 1 against 24-hr CPCB NAAQS 2009 limit (80 µg/m³)
INSERT INTO compliance_assessments (id, station_id, incident_id, standard_id, pollutant, averaging_period, standard_limit, calculated_value, data_completeness_pct, compliance_status)
VALUES
    ('0a000000-0000-0000-0000-000000000001', '04000000-0000-0000-0000-000000000001', '05000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000005', 'SO2', '24h', 80.00, 118.50, 95.83, 'STATUTORY_BREACH')
ON CONFLICT (id) DO NOTHING;
