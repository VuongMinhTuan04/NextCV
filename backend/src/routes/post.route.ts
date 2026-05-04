import express from "express";
import {
    createPostController,
    deletePostController,
    getAllPostController,
    likePostController,
    updatePostController
} from "../controllers/post.controller";
import { authentication } from "../middlewares/auth.middleware";
import {
    canDeletePost,
    canEditAndUpdatePost,
    loadPost,
    validateInputCreatePost,
    validateInputUpdatePost
} from "../middlewares/validatePost.middleware";
import { upload } from "../middlewares/upload.middleware";
import { validateObjectId } from "../middlewares/validateMongoId.middleware";

const router = express.Router();

router.get("/", getAllPostController);

router.post(
    "/create",
    authentication,
    upload.single("file"),
    validateInputCreatePost,
    createPostController
);

router.patch(
    "/like/:id",
    authentication,
    validateObjectId("id"),
    loadPost(),
    likePostController
);

router.patch(
    "/update/:id",
    authentication,
    validateObjectId("id"),
    loadPost(),
    canEditAndUpdatePost,
    validateInputUpdatePost,
    updatePostController
);

router.delete(
    "/delete/:id",
    authentication,
    validateObjectId("id"),
    loadPost(),
    canDeletePost,
    deletePostController
);

export default router;