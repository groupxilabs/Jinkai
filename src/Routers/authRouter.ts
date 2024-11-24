import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { fetchAllUsers, fetchUserById, verifyUser } from '../Controllers/authController';

export const authRouter = express.Router();

authRouter.post('/verify', verifyUser);
authRouter.get('/user/:id', fetchUserById); 
authRouter.get('/users', fetchAllUsers);