import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import perfumeRoutes from "./routes/perfumeRoutes";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://do-da-fragrances.vercel.app",
      "https://do-da-fragrances.onrender.com",
      "https://doda-fragrances.onrender.com",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "Hello from backend" }));
app.use("/auth", authRoutes);
app.use("/perfumes", authMiddleware, perfumeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
