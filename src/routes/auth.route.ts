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
  return res.status(400).json({ message: "Email y contraseña son obligatorios." });
  }

  try {

    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, password_hash: passwordHash, role });
    res.status(201).json({ message: "Usuario registrado con éxito" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
});



router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });    }

    const passwordOk = await bcrypt.compare(password, usuario.password_hash);
    
    if (!passwordOk) {
      return res.status(401).json({ message: "Contraseña incorrecta" });    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Falta la clave secreta en el .env" });
    }

    const token = jwt.sign(
      { email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    
    res.status(500).json({ message: "Error en el servidor al intentar iniciar sesión." });
  }
});


export default router;