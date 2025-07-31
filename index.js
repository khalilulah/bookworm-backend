import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`);
});

app.use("/api/user", authRoutes);
app.use("/api/user", bookRoutes);
console.log("Cloudinary Secret:", process.env.API_SECRET);

app.get("/", (req, res) => {
  res.send("i'm in");
});

mongoose
  .connect(
    "mongodb+srv://alausakhalil:lap1topic@cluster0.dfzrn0v.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection fail");
  });
