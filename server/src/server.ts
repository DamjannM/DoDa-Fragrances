import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import perfumeRoutes from "./routes/perfumeRoutes";
import authMiddleware from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://172.28.160.1:5173/",
      "http://localhost:5173",
      "https://do-da-fragrances.vercel.app",
      "https://do-da-fragrances.onrender.com",
      "https://doda-fragrances.onrender.com",
    ],

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "Hello from backend" }));
app.use("/auth", authRoutes);
app.use("/perfumes", authMiddleware, perfumeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
