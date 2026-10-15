import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
const users = [];

app.use(express.json());


app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });
    res.status(201).json({ message: "Usuario creado" });
});



app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });
        const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) return res.status(400).json({ message: "Credenciales inválidas" });
        const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({ token });
});



function authenticateToken(req, res, next) {
const authHeader = req.headers.authorization;
const token = authHeader?.split(" ")[1];
    if (!token) return res.sendStatus(401);
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
        req.user = payload;
        next();
    });
}


function authorizeRole(role) {
    return (req, res, next) => {
    if (req.user.role !== role) return res.sendStatus(403);
        next();
    };
}

app.get("/admin/dashboard", authenticateToken, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Bienvenido al panel de admin" });
});
app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});