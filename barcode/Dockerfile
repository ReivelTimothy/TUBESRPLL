FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5174
# Gunakan --host agar bisa diakses dari IP HP melalui Wi-Fi
CMD ["npm", "run", "dev", "--", "--port", "5174", "--host"]