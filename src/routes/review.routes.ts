import express from "express"
import reviewController from "../controllers/review.controller"

const reviewRouter = express.Router()

reviewRouter.post("/create-review", reviewController.createReview)

export default reviewRouter