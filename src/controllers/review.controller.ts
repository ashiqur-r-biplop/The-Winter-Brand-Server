import { NextFunction, Response, Request } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import reviewModel, { IReview } from "../models/review.model"
import sendResponse from "../utils/sendResponse"
import orderModel, { IOrder } from "../models/order.model"
// TODO  create order
const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orderId = req?.body?.order_id

        if (!orderId) return next(new ErrorHandler("order id required", httpStatus.OK))
        const reviewData = req.body as IReview
        const order = await orderModel.findById(orderId)
        if (!order) return next(new ErrorHandler("Invalid order id", httpStatus.BAD_REQUEST))
        const newReview = {
            rating: reviewData.rating,
            name: reviewData.name,
            review: reviewData.review,
        }

        order.user_review = newReview

        await order?.save()


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
            reviews = await orderModel.find({ user_review: { $exists: true } }).select("user_review").sort({ createdAt: sort }).limit(reviewsLimit)
        } else if (reviewsLimit) {
            reviews = await reviewModel.find({ user_review: { $exists: true } }).select("user_review").limit(reviewsLimit)
        } else {
            reviews = await reviewModel.find().select("user_review")
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