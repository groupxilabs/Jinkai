import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());
// app.use('/api/');

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//SF4nv3OCBQmexwO9