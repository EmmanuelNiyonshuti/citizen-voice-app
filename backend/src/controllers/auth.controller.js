import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import { generateToken, setTokenCookie } from "../middleware/auth.middleware.js";


export const login = asyncHandler(async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email }).populate('agency');
      if (!user || !await user.comparePassword(password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      // Update last login
      user.lastLogin = new Date();
      await user.save();
  
      // Generate token and set cookie
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      
      // Prepare user data for response
      const userData = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };

      // Include agency data if user is an agency admin
      if (user.role === 'agencyadmin' && user.agency) {
        userData.agency = {
          id: user.agency._id,
          name: user.agency.name,
          slug: user.agency.slug,
          categories: user.agency.categories
        };
      }

      res.json({
        success: true,
        user: userData
      });
  })

export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }); 
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}