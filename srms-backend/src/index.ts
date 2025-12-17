import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => res.json({ message: "SRMS Backend is running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
