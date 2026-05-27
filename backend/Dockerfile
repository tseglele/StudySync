FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --network-timeout=300000
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
