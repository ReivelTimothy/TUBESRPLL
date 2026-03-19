
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g sequelize-cli ts-node typescript
COPY . .
EXPOSE 3000
CMD ["node", "src/app.ts"]