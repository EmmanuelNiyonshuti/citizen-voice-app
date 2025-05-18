import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireAdmin, requireAnyAdmin, checkComplaintAccess } from '../middleware/auth.middleware.js';
import { submitComplaint, trackComplaint, getAllComplaints, updateComplaintStatus } from '../controllers/complaints.controller.js';
import upload from '../middleware/multer.middleware.js'
import { complaintValidation } from '../middleware/validation.middleware.js';

const complaintRouter = express.Router();


// Submit complaint
complaintRouter.post('/',
  upload.single('image'),
  complaintValidation,
  submitComplaint
);

// Track complaint by ticket ID
complaintRouter.get('/track/:ticketId', trackComplaint);

// Get all complaints (admin only)
complaintRouter.get('/',
  authenticateToken,
  requireAdmin,
  getAllComplaints
);

// Update complaint status (admin and agency admin)
complaintRouter.patch('/:id',
  authenticateToken,
  requireAnyAdmin,
  checkComplaintAccess,
  [
    body('status').isIn(['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'])
      .withMessage('Invalid status'),
    body('message').optional().isString()
      .trim()
      .notEmpty()
      .withMessage('Response message cannot be empty if provided')
  ],
  updateComplaintStatus
);

export default complaintRouter;
