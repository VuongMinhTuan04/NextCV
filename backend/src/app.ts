import express, { Response, Request } from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db";
import path from "path";

import postRouter from "./routes/post.route";
import authRouter from "./routes/auth.route";
import commentRouter from "./routes/comment.route";
import notificationRouter from "./routes/notification.route";
import informationRouter from "./routes/information.route";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

//app
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/information", informationRouter);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*splat}", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.use((req: Request, res: Response) => {
   res.status(404).json({ message: "404 Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`NextCV running on port http://localhost:${PORT}`);
});