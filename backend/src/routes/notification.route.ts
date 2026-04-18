import express from "express";
import {
    getAllNotificationsController,
    markAllNotificationsAsReadController,
    markNotificationAsReadController
} from "../controllers/notification.controller";
import { authentication } from "../middlewares/auth.middleware";
import { validateObjectId } from "../middlewares/validateMongoId.middleware";

const router = express.Router();

router.get("/", authentication, getAllNotificationsController);

router.patch(
    "/read-all",
    authentication, 
    markAllNotificationsAsReadController
);

router.patch(
    "/read/:id",
    authentication,
    validateObjectId("id"),
    markNotificationAsReadController
);

export default router;