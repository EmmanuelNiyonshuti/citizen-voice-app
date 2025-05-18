import express from 'express';
import { submitFeedback } from '../controllers/feedback.contoller.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/', submitFeedback);

export default feedbackRouter; 