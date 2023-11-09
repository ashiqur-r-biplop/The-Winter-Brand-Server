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
const updateReviewStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = req.params.id

        await reviewModel.findByIdAndUpdate(reviewId, {
            $set: {
                status: "approved"
            }
        }, { new: true })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'review status updated successfully'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const reviewType = req.query?.type
        let reviews;
        if (reviewType) {
            reviews = await reviewModel.find({ status: reviewType }).sort({ createdAt: -1 })
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
const getReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewsLimit = parseInt(req.query?.limit as string)
        const sort = req.query?.sort === "des" ? -1 : 1
        let reviews;
        if (reviewsLimit && sort) {
            reviews = await reviewModel.find({ status: "approved" }).sort({ createdAt: sort }).limit(reviewsLimit)
        } else if (reviewsLimit) {
            reviews = await reviewModel.find({ status: "approved" }).limit(reviewsLimit)
        } else {
            reviews = await reviewModel.find({ status: "approved" })
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
const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = req.params?.id
        await reviewModel.findByIdAndDelete(reviewId)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "review deleted successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



const reviewController = {
    createReview,
    updateReviewStatus,
    getAllReviews,
    getReviews,
    deleteReview
}

export default reviewController