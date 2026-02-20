# --- Stage 1: Build Stage ---
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build aplikasi (menghasilkan folder 'dist' atau 'build')
RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:stable-alpine

# Copy hasil build dari stage 1 ke folder standar Nginx
# Jika kamu pakai Vite, biasanya foldernya 'dist'. Jika Create React App, biasanya 'build'.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Ekspos port 80 untuk web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]