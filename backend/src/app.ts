import express, { Response, Request } from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import connectDB from "./configs/db";
import postRouter from "./routes/post.route";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//app
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use((req: Request, res: Response) => {
   res.status(404).json({ message: "404 Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`NextCV running on port http://localhost:${PORT}/api/auth`);
});