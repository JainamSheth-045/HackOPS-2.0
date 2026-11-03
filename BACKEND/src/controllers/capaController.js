import { supabase } from '../config/supabase.js';

/**
 * Controller to fetch CAPA (Corrective and Preventive Action) details for an incident
 * Supports lookup by incident UUID or tracking code (e.g. INC-2026-00101)
 */
export const getCapaDetails = async (req, res) => {
  try {
    const rawId = req.params.id || req.query.incident_id || req.query.id;

    if (!rawId || !rawId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Incident ID or tracking code is required'
      });
    }

    const identifier = rawId.trim();
    let resolvedIncidentId = identifier;
    let incidentDetails = null;

    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

    // Resolve tracking code to incident UUID if not a UUID
    if (!isUuid) {
      const { data: inc, error: incErr } = await supabase
        .from('incidents')
        .select('id, tracking_code, incident_type, severity, status, description, location_id')
        .eq('tracking_code', identifier)
        .maybeSingle();

      if (incErr) {
        console.error('Error looking up incident by tracking code:', incErr);
      } else if (inc) {
        resolvedIncidentId = inc.id;
        incidentDetails = inc;
      }
    } else {
      const { data: inc } = await supabase
        .from('incidents')
        .select('id, tracking_code, incident_type, severity, status, description, location_id')
        .eq('id', identifier)
        .maybeSingle();
      if (inc) {
        incidentDetails = inc;
      }
    }

    // Query Supabase corrective_actions table
    const { data: capaRecords, error: capaErr } = await supabase
      .from('corrective_actions')
      .select('*')
      .eq('incident_id', resolvedIncidentId)
      .order('created_at', { ascending: false });

    if (capaErr) {
      console.error('Supabase corrective_actions query error:', capaErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve CAPA details from database',
        error: capaErr.message
      });
    }

    // Query departmental assignments for responsible team metadata
    const { data: assignmentRecords } = await supabase
      .from('incident_assignments')
      .select('assigned_department, assigned_to_name, priority, notes, assigned_at')
      .eq('incident_id', resolvedIncidentId);

    const hasRecords = capaRecords && capaRecords.length > 0;

    return res.status(200).json({
      success: true,
      incident_id: resolvedIncidentId,
      incident: incidentDetails,
      has_capa: hasRecords,
      capa_records: capaRecords || [],
      assignments: assignmentRecords || [],
      message: hasRecords
        ? 'CAPA details retrieved successfully'
        : 'No CAPA details available for this incident'
    });
  } catch (err) {
    console.error('getCapaDetails exception:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching CAPA details',
      error: err.message
    });
  }
};

