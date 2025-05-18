import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Agency from '../models/agency.js';
import Complaint from '../models/complaint.js';

// Verify JWT token from cookie
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('agency');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user is admin or agency admin
const requireAnyAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'agencyadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Administrative access required'
    });
  }
  next();
};

// Check if user has access to the complaint based on agency
const checkComplaintAccess = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(); // Admin has access to all complaints
    }

    if (req.user.role !== 'agencyadmin') {
      return res.status(403).json({
        success: false,
        message: 'Administrative access required'
      });
    }

    const complaintId = req.params.id;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if complaint category matches agency categories
    if (!req.user.agency.categories.includes(complaint.category)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this complaint category'
      });
    }

    next();
  } catch (error) {
    console.error('Complaint access check error:', error);
    next(error);
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Set JWT token in cookie
const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
};

export {
  authenticateToken,
  requireAdmin,
  requireAnyAdmin,
  checkComplaintAccess,
  generateToken,
  setTokenCookie
}; 