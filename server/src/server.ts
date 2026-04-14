import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSockets } from './api/sockets/index'; // Updated import name
import connectDB from './persistence/db';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // or your frontend URL
    methods: ["GET", "POST"]
  }
});

// Connect to Database
connectDB();

// Initialize Sockets
setupSockets(io); // Updated function call name

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});