import express from 'express';
import { getAgencyComplaints, getAgencyStats } from '../controllers/agency.controller.js';
import { authenticateToken, requireAnyAdmin } from '../middleware/auth.middleware.js';

const agencyRouter = express.Router();

// Apply authentication middleware to all routes
agencyRouter.use(authenticateToken);
agencyRouter.use(requireAnyAdmin);

// Agency routes
agencyRouter.get('/complaints', getAgencyComplaints);
agencyRouter.get('/complaints/stats', getAgencyStats);

export default agencyRouter;
 