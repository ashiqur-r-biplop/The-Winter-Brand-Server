import express from "express";
import analyticsController from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware";
import { USER_ROLE } from "../enum/userRole";
const analyticsRouter = express.Router()


analyticsRouter.get("/get-total-data-count", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), analyticsController.getTotalCreatedData)

analyticsRouter.get("/get-recent-orders-reviews", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), analyticsController.getRecentOrdersReviews)

export default analyticsRouter