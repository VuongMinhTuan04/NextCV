import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db";
import postRouter from "./routes/post.route";
import authRouter from "./routes/auth.route";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//app
app.use(cors());
app.use(express.json());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`NextCV running on port http://localhost:${PORT}/api/auth`);
});