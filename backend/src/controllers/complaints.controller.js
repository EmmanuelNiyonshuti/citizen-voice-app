import { validationResult } from "express-validator";
import Complaint from "../models/complaint.js";
import asyncHandler from "express-async-handler";


export const submitComplaint = asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const complaintData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      };
      console.log(complaintData);
      const complaint = await Complaint.create(complaintData);
      res.status(201).json({
        success: true,
        complaint: {
          ticketId: complaint.ticketId,
          status: complaint.status,
          createdAt: complaint.createdAt
        }
      });
  })

  export const trackComplaint = asyncHandler(async (req, res) => {
      const complaint = await Complaint.findOne({ ticketId: req.params.ticketId })
        .select('-email -__v')
        .lean();
  
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found'
        });
      }
  
      res.json({
        success: true,
        complaint
      });
    })


export const getAllComplaints = asyncHandler(async (req, res) => {
      const { category, status, page = 1, limit = 10 } = req.query;
      const query = {};

      if (category) query.category = category;
      if (status) query.status = status;

      const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      const total = await Complaint.countDocuments(query);

      res.json({
        success: true,
        complaints,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      });
  })

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const complaint = await Complaint.findById(req.params.id);
  
  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found'
    });
  }

  // Update status
  complaint.status = req.body.status;
  
  // Add response if provided
  if (req.body.message) {
    complaint.responses = complaint.responses || [];
    complaint.responses.push({
      message: req.body.message,
      respondedAt: new Date(),
      respondedBy: req.user._id,
      responderRole: req.user.role,
      responderAgency: req.user.role === 'agencyadmin' ? req.user.agency : undefined
    });
  }

  await complaint.save();

  res.json({
    success: true,
    complaint
  });
});