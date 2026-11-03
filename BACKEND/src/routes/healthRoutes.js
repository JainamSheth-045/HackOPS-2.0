import { Router } from 'express';
import { getHealthStatus, getDbHealthStatus } from '../controllers/healthController.js';

const router = Router();

// GET /api/health
router.get('/health', getHealthStatus);

// GET /api/health/db
router.get('/health/db', getDbHealthStatus);

export default router;

