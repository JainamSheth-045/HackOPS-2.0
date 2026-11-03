import { Router } from 'express';
import { runDiagnostics } from '../controllers/diagnosticController.js';

const router = Router();

// POST /api/diagnostics - Run expert rule-based copilot diagnostic
router.post('/diagnostics', runDiagnostics);

export default router;

