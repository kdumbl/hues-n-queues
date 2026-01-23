import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend connection
  }),
);
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "backend connected" });
});

export default app;
