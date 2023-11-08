import express from "express"
import reviewController from "../controllers/review.controller"

const reviewRouter = express.Router()

reviewRouter.post("/create-review", reviewController.createReview)
reviewRouter.put("/update-review-status/:id", reviewController.updateReviewStatus)
reviewRouter.get("/get-all-reviews", reviewController.getAllReviews)
reviewRouter.get("/get-reviews", reviewController.getReviews)


export default reviewRouter