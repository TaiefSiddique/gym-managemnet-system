import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import userRoutes from './routes/user.routes';
import scheduleRoutes from './routes/schedule.routes';
import errorHandler from './middlewares/error.middleware';

dotenv.config();

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/schedules', scheduleRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});