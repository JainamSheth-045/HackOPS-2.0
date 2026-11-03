import { Router } from 'express';
import { getCapaDetails } from '../controllers/capaController.js';

const router = Router();

// GET /api/incidents/:id/capa
router.get('/incidents/:id/capa', getCapaDetails);

// GET /api/capa/:id
router.get('/capa/:id', getCapaDetails);

// GET /api/capa?incident_id=...
router.get('/capa', getCapaDetails);

export default router;

