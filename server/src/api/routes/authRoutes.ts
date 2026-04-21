import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../../services/AuthService";
 
const router = Router();
 
const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";
 
// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
 
  try {
    const user = await AuthService.register(username, email, password);
 
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
 
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
 
// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
 
  try {
    const user = await AuthService.login(email, password);
 
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
 
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});
 
export default router;