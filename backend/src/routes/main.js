import express from "express";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import complaintRouter from "./complaints.js";
import feedbackRouter from "./feedback.js";
import agencyRouter from "./agency.js";

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/complaints', complaintRouter);
router.use('/feedback', feedbackRouter);
router.use('/agency', agencyRouter);

export default router;
