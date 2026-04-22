import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./persistence/db";
import authRoutes from "./api/routes/authRoutes";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { setupSockets } from "./api/sockets/index"; // Updated import name

const app = express();
app.use(cors());
app.use(express.json());
//app.use(); //eventaully require authentication here

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use("/auth", authRoutes);

//socket connection given to socket layer
// Initialize Sockets
setupSockets(io); // Updated function call name

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
