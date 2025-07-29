import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import googleAuthRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";

dotenv.config();

const app = express();
app.use(cors({
  origin:"https://notes-app-steel-two.vercel.app",  // allow only your frontend
  credentials: true                // allow cookies/headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "sessionsecret",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
