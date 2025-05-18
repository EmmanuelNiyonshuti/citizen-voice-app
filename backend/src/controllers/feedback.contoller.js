import Feedback from "../models/feedback.js";
import asyncHandler from "express-async-handler";

export const submitFeedback = asyncHandler(async (req, res) => {
      const { fullName, email, type, message } = req.body;
      const feedback = new Feedback({
        fullName,
        email,
        type,
        message
      });
      // Save to database
      await feedback.save();
      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully'
      });
  })
