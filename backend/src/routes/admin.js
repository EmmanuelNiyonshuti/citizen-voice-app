import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { getComplaintStats, exportComplaints } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

// Protect all admin routes
adminRouter.use(authenticateToken, requireAdmin);

// Get complaint statistics
adminRouter.get('/stats', getComplaintStats);

// Export complaints as CSV
adminRouter.get('/export', exportComplaints);

export default adminRouter;
