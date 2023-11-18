import express from "express"
import layoutController from "../controllers/layout.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const layoutRouter = express.Router()

layoutRouter.get("/get-faqs", layoutController.getFaqs)
layoutRouter.get("/get-featured-images", layoutController.getFeaturedImage)
// admin only 
layoutRouter.post("/create-layout", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), layoutController.createLayout)
layoutRouter.put("/update-featured-image", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), layoutController.updateFeaturedImage)
layoutRouter.put("/delete-multiple-images", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), layoutController.deleteMultipleFeaturedImages)
layoutRouter.delete("/delete-layout", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), layoutController.deleteLayout)

export default layoutRouter