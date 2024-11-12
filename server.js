import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoute.js';
import employeeRoutes from './routes/employeeRoute.js';
import leaveRoutes from './routes/leaveRoute.js';
import interviewRoutes from './routes/interviewRoute.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',  
  credentials: true,              
}));

// Routes
app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/employee', employeeRoutes);
app.use('/leave', leaveRoutes);
app.use('/interview', interviewRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));