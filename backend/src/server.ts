import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import emailRoutes from './routes/email.routes';
import simulationRoutes from './routes/simulation.routes';

// Завантаження змінних середовища
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'PhishTrainer API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      emails: '/api/emails',
      simulation: '/api/simulation',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/simulation', simulationRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({
    error: 'Внутрішня помилка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📧 API доступний за адресою: http://localhost:${PORT}/api`);
  console.log(`🌍 Середовище: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
