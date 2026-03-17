import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// @ts-ignore
import db from './models';
import attendanceRoute from './routes/attendanceRoute';

// Inisialisasi dotenv
dotenv.config();

const app = express();


const port = process.env.PORT || 1111;

// 1. MIDDLEWARE UTAMA
app.use(express.json());

// Konfigurasi CORS menggunakan .env
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Tambahkan ini jika nanti pakai Cookie/Session (HCRM project)
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. ROUTES
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to HCRM API' });
});

app.use('/attendance', attendanceRoute);

// 3. GLOBAL ERROR HANDLER (Harus paling bawah)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 Error Stack:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        success: false,
        message: err.message || 'Internal Server Error' 
    });
});

// 4. DATABASE CONNECTION & SERVER START
// Menggunakan sync() opsional jika kamu ingin Sequelize otomatis urus tabel (tapi kamu pakai migrasi, jadi authenticate cukup)
db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Berhasil terhubung ke database PostgreSQL.');
        
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📡 Accepting requests from: ${process.env.CLIENT_URL || 'muhahahah'}`);
        });
    })
    .catch((err: any) => {
        console.error('❌ Tidak bisa terhubung ke database:', err);
        process.exit(1); 
    });