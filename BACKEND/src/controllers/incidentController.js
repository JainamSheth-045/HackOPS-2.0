import { supabase } from '../config/supabase.js';

// Predefined location fallback coordinates
const LOCATION_DEFAULTS = {
  '03000000-0000-0000-0000-000000000001': {
    name: 'Vapi GIDC Chemical Estate',
    address: 'Phase II, Vapi GIDC, Valsad, Gujarat',
    lat: 20.3712,
    lng: 72.9106
  },
  '03000000-0000-0000-0000-000000000002': {
    name: 'Manesar IMT Automotive Belt',
    address: 'Sector 8, IMT Manesar, Gurugram, Haryana',
    lat: 28.3518,
    lng: 76.9412
  },
  '03000000-0000-0000-0000-000000000003': {
    name: 'Tarapur MIDC Heavy Engineering',
    address: 'Zone III, Tarapur MIDC, Palghar, Maharashtra',
    lat: 19.808,
    lng: 72.695
  },
  '03000000-0000-0000-0000-000000000004': {
    name: 'Surat Ring Road Transit Corridor',
    address: 'Varachha Ring Road, Surat, Gujarat',
    lat: 21.1702,
    lng: 72.8311
  }
};

const DEFAULT_CATEGORY_ID = 'c1000000-0000-0000-0000-000000000001'; // Environmental Pollution
const DEFAULT_LOCATION_ID = '03000000-0000-0000-0000-000000000001'; // Vapi GIDC

/**
 * Create a new community or industrial incident report
 * POST /api/incidents
 */
export const createIncident = async (req, res) => {
  try {
    const {
      category_id,
      location_id,
      incident_type,
      pollutant,
      severity,
      suspected_source,
      description,
      address,
      latitude,
      longitude,
      reporter_name,
      reporter_contact
    } = req.body;

    // Field validations
    const errors = [];
    if (!description || typeof description !== 'string' || !description.trim()) {
      errors.push('Incident description is required.');
    }

    const validSeverities = ['Low', 'Moderate', 'High', 'Critical'];
    const chosenSeverity = severity && validSeverities.includes(severity) ? severity : 'Moderate';

    // Construct incident type from specific pollutant or generic type
    let finalIncidentType = incident_type;
    if (!finalIncidentType && pollutant) {
      finalIncidentType = `${pollutant} Emission Exceedance`;
    }
    if (!finalIncidentType || !finalIncidentType.trim()) {
      finalIncidentType = 'Environmental Pollution Exceedance';
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Resolve location & coordinates
    const chosenLocationId = location_id || DEFAULT_LOCATION_ID;
    const locationInfo = LOCATION_DEFAULTS[chosenLocationId] || LOCATION_DEFAULTS[DEFAULT_LOCATION_ID];

    const finalLat = typeof latitude === 'number' ? latitude : locationInfo.lat;
    const finalLng = typeof longitude === 'number' ? longitude : locationInfo.lng;

    let finalAddress = address && address.trim() ? address.trim() : locationInfo.address;
    if (suspected_source && suspected_source.trim()) {
      finalAddress = `${suspected_source.trim()} (${finalAddress})`;
    }

    // Generate unique tracking code: INC-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `INC-${year}-${randomSuffix}`;

    const newIncident = {
      tracking_code: trackingCode,
      category_id: category_id || DEFAULT_CATEGORY_ID,
      location_id: chosenLocationId,
      incident_type: finalIncidentType.trim(),
      latitude: finalLat,
      longitude: finalLng,
      address: finalAddress,
      severity: chosenSeverity,
      status: 'Submitted',
      description: description.trim(),
      reporter_name: reporter_name && reporter_name.trim() ? reporter_name.trim() : 'Anonymous Citizen',
      reporter_contact: reporter_contact && reporter_contact.trim() ? reporter_contact.trim() : null,
      is_simulated: true
    };

    // Insert into Supabase incidents table
    const { data, error } = await supabase
      .from('incidents')
      .insert([newIncident])
      .select('id, tracking_code, category_id, location_id, incident_type, severity, status, description, created_at');

    if (error) {
      console.error('Supabase incident insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to record incident in database',
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Incident reported successfully and logged to database',
      incident: data && data.length > 0 ? data[0] : newIncident
    });
  } catch (err) {
    console.error('createIncident unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred',
      error: err.message
    });
  }
};

/**
 * Retrieve public incidents list
 * GET /api/incidents
 */
export const getIncidents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    // First attempt to query public_incidents security invoker view
    const { data, error } = await supabase
      .from('public_incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Fallback query to incidents table
      const fallback = await supabase
        .from('incidents')
        .select('id, tracking_code, category_id, location_id, incident_type, latitude, longitude, address, severity, status, description, is_simulated, created_at, updated_at, resolved_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fallback.error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch incidents',
          error: fallback.error.message
        });
      }

      return res.status(200).json({
        success: true,
        incidents: fallback.data || []
      });
    }

    return res.status(200).json({
      success: true,
      incidents: data || []
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: err.message
    });
  }
};

