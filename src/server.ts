import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { CronJob } from 'cron';
import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import { notificationRouter } from './Routers/notificationRouter';
import bodyParser from 'body-parser';
import { willRouter } from './Routers/willRouter';
import { sendWillNotifications } from './Services/notificationService';

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/notification', notificationRouter);
app.use('/api/', willRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Crypto-Will');
});

const mongodb = process.env.MONGO_URI || 'mongodb+srv://agbakwuruoluchi:SF4nv3OCBQmexwO9@cluster0.rt46t.mongodb.net';
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

const job = new CronJob('0 0 * * *', async () => {
    console.log('Running cron job to send notifications at midnight');
    await sendWillNotifications(); 
  }, null, true, 'Africa/Lagos');  
  
  job.start();
  

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; 
