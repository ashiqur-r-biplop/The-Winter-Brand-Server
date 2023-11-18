import express from "express"
import reviewController from "../controllers/review.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const reviewRouter = express.Router()

reviewRouter.post("/create-review", isAuthenticated, reviewController.createReview)
// only admin
reviewRouter.get("/get-all-reviews", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), reviewController.getReviews)



export default reviewRouter