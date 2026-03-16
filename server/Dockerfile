# Gunakan node versi terbaru yang stabil
FROM node:20-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy package.json dan lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Sequelize CLI secara global agar bisa running migrasi di container
RUN npm install -g sequelize-cli

# migrate database tables


# Copy seluruh kode sumber server
COPY . .

# Ekspos port 3000 (sesuai settingan Express kamu)
EXPOSE 3000

# Command untuk menjalankan aplikasi
# Kita gunakan node src/index.js (sesuaikan jika file utama kamu berbeda)
CMD npx sequelize-cli db:migrate && node src/index.js