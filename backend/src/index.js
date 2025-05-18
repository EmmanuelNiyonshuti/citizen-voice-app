import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/main.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import logger from './middleware/logger.middleware.js';
import notFound from './middleware/notfound.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(logger)

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Routes
app.use('/api', router);

// notfound middleware
app.use(notFound);
// Error handling middleware
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 