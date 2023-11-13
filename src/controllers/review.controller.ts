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
            name: reviewData.name,
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

const getReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewsLimit = parseInt(req.query?.limit as string)
        const sort = req.query?.sort === "des" ? -1 : 1
        let reviews;
        if (reviewsLimit && sort) {
            reviews = await reviewModel.find().sort({ createdAt: sort }).limit(reviewsLimit)
        } else if (reviewsLimit) {
            reviews = await reviewModel.find().limit(reviewsLimit)
        } else {
            reviews = await reviewModel.find()
        }

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: reviews
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})




const reviewController = {
    createReview,
    getReviews,

}

export default reviewController