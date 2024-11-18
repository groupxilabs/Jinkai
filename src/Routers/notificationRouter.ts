import express from 'express';
import { WillNotifications } from '../Controllers/notificationController'

export const notificationRouter = express.Router();

notificationRouter.get('/send-notifications', WillNotifications)

