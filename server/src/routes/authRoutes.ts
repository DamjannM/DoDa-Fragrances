import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import db from "../db";
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
    // const insertUser = db.prepare(
    //   `INSERT INTO users (email,password, role) VALUES (?, ?, ?)`,
    // );
    // const result = insertUser.run(email, hashedPassword, role);
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
    // const getUser = db.prepare("SELECT * FROM users WHERE email = ?");
    // const user = getUser.get(email);
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in successfully", role: user.role });
  } catch (err: any) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

//LOGOUT
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

//ME
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
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
