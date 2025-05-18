import express from 'express';
import { body } from 'express-validator';
import {login, logout }from '../controllers/auth.controller.js'

const authRouter = express.Router();

// Login validation middleware
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// Login route
authRouter.post('/login', loginValidation, login);

// Logout route
authRouter.post('/logout', logout);

export default authRouter;
