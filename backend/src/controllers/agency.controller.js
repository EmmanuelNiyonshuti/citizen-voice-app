import asyncHandler from 'express-async-handler';
import Complaint from '../models/complaint.js';

// Get complaints for agency admin's agency
export const getAgencyComplaints = asyncHandler(async (req, res) => {
  const { agency } = req.user;

  const complaints = await Complaint.find({
    category: { $in: agency.categories }
  })
  .sort({ createdAt: -1 })
  .populate('assignedAgency');

  res.json({
    success: true,
    complaints
  });
});

// Get complaint statistics for agency
export const getAgencyStats = asyncHandler(async (req, res) => {
  const { agency } = req.user;

  const stats = await Complaint.aggregate([
    {
      $match: {
        category: { $in: agency.categories }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0]
          }
        },
        inReview: {
          $sum: {
            $cond: [{ $eq: ['$status', 'IN_REVIEW'] }, 1, 0]
          }
        },
        resolved: {
          $sum: {
            $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0]
          }
        },
        rejected: {
          $sum: {
            $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const defaultStats = {
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0
  };

  res.json(stats[0] || defaultStats);
}); 