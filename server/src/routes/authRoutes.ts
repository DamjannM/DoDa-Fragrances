import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prismaClient";

dotenv.config();
const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  let { role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  if (!role) {
    role = "user";
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: "24h",
    });

    res.json({ token, role });
  } catch (error: any) {
    if (
      error.code === "P2002" &&
      error.message?.includes("UNIQUE constraint failed: users.email")
    ) {
      return res.status(400).send({ message: "User already exists" });
    }

    console.error(error);
    res.status(503).send({ message: "Something went wrong" });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, String(user.password));
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }

    const expiresIn = rememberMe ? "30d" : "2h";

    const token = jwt.sign({ id: user.id }, secret, { expiresIn });

    res.json({ message: "Logged in successfully", role: user.role, token });
  } catch (err: any) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

//LOGOUT
router.post("/logout", async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

//ME
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return res.json({
      isAuthenticated: true,
      userId: decoded.id,
      role: user?.role,
    });
  } catch (err) {
    return res.status(401).json({ isAuthenticated: false });
  }
});

export default router;
