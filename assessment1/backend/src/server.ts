import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (_req, res) => {
  res.send("Backend server is running");
});

app.use("/api/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});