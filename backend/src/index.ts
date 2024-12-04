// src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/users';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});