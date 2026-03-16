const express = require('express');
const { sequelize } = require('./models');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({ message: "Backend PERN Berhasil Terhubung!" });
});


const connectWithRetry = () => {
  console.log('Mencoba menghubungkan ke Database...');
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database Terkoneksi (Postgres)');
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server jalan di http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Gagal konek, mencoba lagi dalam 5 detik...', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();