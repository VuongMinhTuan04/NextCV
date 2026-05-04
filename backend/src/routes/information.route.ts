import express from "express";
import { authentication } from "../middlewares/auth.middleware";
import {
    changeMyPasswordController,
    getInformationByIdController,
    searchFullnameUserController,
    updateMyInformationController,
} from "../controllers/information.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router.get("/search", searchFullnameUserController);

router.get("/:id", authentication, getInformationByIdController);

router.patch("/me", authentication, upload.single("avatar"), updateMyInformationController);

router.patch("/change-password", authentication, changeMyPasswordController);

export default router;