import { Server } from "socket.io";
import connectDB from "./persistence/db";
import authRoutes from "./api/routes/authRoutes";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { setupSockets } from "./api/sockets/index";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use("/auth", authRoutes);

setupSockets(io); 

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
