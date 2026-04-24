import { Socket, Server } from "socket.io";
import jwt from "jsonwebtoken";
import { tokenPayload } from "../types";

export function authSocket(io: Server): void {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === "string") {
        return next(new Error("Invalid token payload"));
      }

      socket.data.user = decoded as tokenPayload;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });
}
