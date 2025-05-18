import { body } from "express-validator";

// Complaints Validation middleware
export const complaintValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('category').isIn([
      'INFRASTRUCTURE',
      'WATER_SANITATION',
      'EDUCATION',
      'HEALTHCARE',
      'PUBLIC_TRANSPORT',
      'SECURITY',
      'CORRUPTION',
      'OTHER'
    ]).withMessage('Invalid category'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('location').optional().trim()
  ];

