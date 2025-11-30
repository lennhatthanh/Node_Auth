import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import cookieParser from "cookie-parser";
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3001;
app.use("/auth", auth);
app.use("/user", user);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
