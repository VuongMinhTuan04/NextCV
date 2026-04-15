import express from "express";
import { getAllPostController } from "../controllers/post.controller";

const router = express.Router();

router.get("/", getAllPostController);

export default router;