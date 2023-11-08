import { NextFunction, Response, Request } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import reviewModel, { IReview } from "../models/review.model"
import sendResponse from "../utils/sendResponse"

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewData = req.body as IReview
        const newReview = {
            rating: reviewData.rating,
            review_title: reviewData.review_title,
            review: reviewData.review,
            email: reviewData.email
        }

        await reviewModel.create(newReview)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'review successfully added'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const reviewController = {
    createReview
}

export default reviewController