import express from 'express';
import { WillNotifications } from '../Controllers/notificationController'
import { sendWillNotifications } from '../Services/notificationService';


export const notificationRouter = express.Router();

notificationRouter.get('/send-notifications/:willId', WillNotifications)

//notificationRouter.get('/test-notifications')