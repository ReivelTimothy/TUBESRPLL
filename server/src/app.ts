import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// @ts-ignore
import db from './models';
import attendanceRoute from './routes/attendanceRoute';
import authRoute from './routes/authRoute';

// Load .env agar terbaca di Docker
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: [
    'http://localhost',      // Origin dari error kamu
    'http://localhost:80',   // Origin alternatif
    'http://localhost:3000', // Jika kamu pakai React dev server (Vite/CRA)
    'http://127.0.0.1'       // Untuk jaga-jaga
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// --- 2. ROUTES ---
app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: 'CRM API is Running' });
});

app.use('/attendance', attendanceRoute);
app.use('/auth', authRoute);

// --- 3. DATABASE & SERVER START ---
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