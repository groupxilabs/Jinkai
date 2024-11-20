import express from 'express';
import { verifyUser } from '../Controllers/authController';

export const authRouter = express.Router();

authRouter.post('/verify', verifyUser);

