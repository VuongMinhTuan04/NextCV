import express from "express";
import {
    createPostController,
    deletePostController,
    getAllPostController,
    updatePostController
} from "../controllers/post.controller";
import { authentication, authorization } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getAllPostController);
router.post("/create", authentication, createPostController);
router.patch("/update/:id", authentication, authorization, updatePostController);
router.delete("/delete/:id", authentication, authorization, deletePostController);

export default router;