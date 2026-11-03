import { supabase } from '../config/supabase.js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../config/env.js';

/**
 * Health Check Controller
 * Verifies backend connectivity and runtime status
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "EcoSentinel AI backend is running",
    status: "healthy"
  });
};

/**
 * Database Health Check Controller
 * Verifies connectivity to Supabase PostgreSQL database
 * Executes a simple SELECT query against incident_categories with a limit of 1
 */
export const getDbHealthStatus = async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(503).json({
        success: false,
        message: "Database connection failed",
        error: "Supabase credentials are not configured in environment variables",
        status: "unhealthy"
      });
    }

    const { data, error } = await supabase
      .from('incident_categories')
      .select('id, name, code')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database health check failed",
        error: error.message || "Query execution error",
        status: "unhealthy"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      status: "connected",
      timestamp: new Date().toISOString(),
      sampleRecord: data && data.length > 0 ? { table: 'incident_categories', recordsFound: data.length } : null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database health check failed",
      error: err.message || "An unexpected error occurred",
      status: "unhealthy"
    });
  }
};


