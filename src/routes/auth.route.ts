import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";

const router = Router();


router.post("/register", async (req: Request, res: Response) => {
  const { email, password, role = 'user' } = req.body;

  if (
  typeof email !== "string" ||
  !email.trim() ||
  typeof password !== "string" ||
  !password
  ) {
  return res.status(400).json({ message: "Email and password are required." });
  }

  try {

    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, password_hash: passwordHash, role });
    res.status(201).json({ message: "User registered successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering the user." });
  }
});



router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: "User not found" });    }

    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    
    if (!passwordOk) {
      return res.status(401).json({ message: "Incorrect password" });    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "The secret key is missing from the environment configuration." });
    }

    const token = jwt.sign(
      { email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    
    res.status(500).json({ message: "Server error while attempting to log in." });
  }
});


export default router;