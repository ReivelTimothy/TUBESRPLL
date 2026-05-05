import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { globalErrorHandler } from './middleware/errorHandler';

import db from './models';
import authRoute from './routes/authRoute';
import leaveRoute from './routes/leaveRoute';
import penaltyRoute from './routes/penaltyRoute';
import reimburseRoute from './routes/reimburseRoute';
import userRoute from './routes/userRoute';

// Load .env agar terbaca di Docker
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;
const uploadsPath = path.resolve(process.cwd(), 'uploads');

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: [
    'http://localhost',
    // ngrok urls
    'https://contortioned-terrell-gymnastically.ngrok-free.dev ', 
    'https://bridgette-shroudless-rolf.ngrok-free.dev',      
    // masukin aja semua biar ga pusing 
    'http://localhost:80',  
    'http://localhost:3000',
    'http://127.0.0.1',
    'http://localhost:5173/'  
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Serve uploaded files for receipt preview
app.use('/uploads', express.static(uploadsPath));

// --- 2. ROUTES ---
app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Asek Jalan sir' });
});

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/leave', leaveRoute);
app.use('/reimburse', reimburseRoute);
app.use('/penalty', penaltyRoute);
app.use(globalErrorHandler);

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ PostgreSQL Connected.');
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📡 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
        });
    })
    .catch((err: any) => {
        console.error('❌ Database Connection Error:', err);
        process.exit(1); 
    });

export default app;