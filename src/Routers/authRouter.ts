import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { verifyUser } from '../Controllers/authController';

export const authRouter = express.Router();

authRouter.post('/verify', verifyUser);


