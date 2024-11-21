import express from 'express';
import { confirmActivity} from '../Controllers/willController';

export const willRouter = express.Router();

willRouter.post('/will/confirm/:willId', confirmActivity);
