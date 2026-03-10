import dotenv from "dotenv";
import http from "http";
import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import { initSockets } from "./api/sockets/index";
import connectDB from "./persistence/db";

dotenv.config();

//create express app
const app: Application = express();
//create http server
const httpServer = http.createServer(app);
//create socket.io server from http server
const io = new Server(httpServer, {
  cors: { origin: "*" }, //accept connection from anywhere
});

//middleware stuff
app.use(express.json());
//app.use(); //eventaully require authentication here

//http routing
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

initSockets(io); //socket connection given to socket layer

//for testing but example of socket layer stuff
io.on("connection", (socket) => {
  console.log(`Connection! ${socket.id}`);
});

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
