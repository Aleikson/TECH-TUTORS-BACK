import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Mongo connected');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(express.json())

app.listen(8000, () => {
  console.log('Server is running on port 8000!');
});

app.use('/api/auth', authRoutes);