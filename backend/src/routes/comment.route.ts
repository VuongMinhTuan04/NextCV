import express from "express";
import {
    createCommentController,
    deleteCommentController,
    getAllCommentsByPostController,
    updateCommentController
} from "../controllers/comment.controller";
import {
    canDeleteComment,
    canUpdateComment,
    loadComment,
    validateInputComment
} from "../middlewares/validateComment.middleware";
import { validateObjectId } from "../middlewares/validateMongoId.middleware";
import { authentication } from "../middlewares/auth.middleware";
import { loadPost } from "../middlewares/validatePost.middleware";

const router = express.Router();

router.get(
    "/post/:postId",
    validateObjectId("postId"),
    getAllCommentsByPostController
);

router.post(
    "/post/:postId",
    authentication,
    validateObjectId("postId"),
    loadPost("postId"),
    validateInputComment,
    createCommentController
);

router.patch(
    "/update/:commentId",
    authentication,
    validateObjectId("commentId"),
    loadComment,
    canUpdateComment,
    validateInputComment,
    updateCommentController
);

router.delete(
    "/delete/:commentId",
    authentication,
    validateObjectId("commentId"),
    loadComment,
    canDeleteComment,
    deleteCommentController
);

export default router;