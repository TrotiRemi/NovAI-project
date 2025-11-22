FROM node:18-alpine

WORKDIR /app

COPY backend/package.json ./backend/

RUN cd backend && npm install

COPY backend/server.js ./backend/

COPY frontend ./frontend

EXPOSE 5000

WORKDIR /app/backend

CMD ["npm", "start"]
