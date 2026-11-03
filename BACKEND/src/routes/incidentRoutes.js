import { Router } from 'express';
import { createIncident, getIncidents } from '../controllers/incidentController.js';

const router = Router();

// POST /api/incidents - Report a new incident
router.post('/incidents', createIncident);

// GET /api/incidents - Retrieve incidents list
router.get('/incidents', getIncidents);

export default router;

