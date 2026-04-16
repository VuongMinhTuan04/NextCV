import express from "express";
import {
    createPostController,
    deletePostController,
    getAllPostController,
    likePostController,
    updatePostController
} from "../controllers/post.controller";
import { authentication, authorization } from "../middlewares/auth.middleware";
import { validateInputPost } from "../middlewares/validateInput.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router.get("/", getAllPostController);
router.post(
    "/create",
    authentication,
    upload.single("file"),
    validateInputPost,
    createPostController
);
router.patch("/like/:id", authentication, likePostController);
router.patch(
    "/update/:id",
    authentication,
    authorization,
    updatePostController
);
router.delete(
    "/delete/:id",
    authentication,
    authorization,
    deletePostController
);

export default router;