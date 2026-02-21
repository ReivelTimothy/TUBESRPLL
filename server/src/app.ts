import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// @ts-ignore
import db from './models';
import attendanceRoute from './routes/attendanceRoute';

const app = express();
const port = 3000;

// 1. MIDDLEWARE UTAMA (Harus di atas sebelum Route)
app.use(express.json());

// Konfigurasi CORS yang benar
// Catatan: origin biasanya adalah alamat FRONTEND (misal localhost:5173), bukan backend
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. ROUTES
app.use('/attendance', attendanceRoute);

// 3. GLOBAL ERROR HANDLER (Harus paling bawah setelah Route)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        success: false,
        message: err.message || 'Internal Server Error' 
    });
});

// 4. DATABASE CONNECTION & SERVER START
db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Berhasil terhubung ke database PostgreSQL.');
        
        // HANYA panggil listen satu kali di sini
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    })
    .catch((err: any) => {
        console.error('❌ Tidak bisa terhubung ke database:', err);
        process.exit(1); 
    }
);