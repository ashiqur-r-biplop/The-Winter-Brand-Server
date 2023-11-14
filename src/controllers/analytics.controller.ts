import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import httpStatus from "http-status"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import userModel from "../models/user.model"
import orderModel from "../models/order.model"
import reviewModel from "../models/review.model"
import contactModel from "../models/contact.model"


const getTotalCreatedData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUser = await userModel.estimatedDocumentCount()
        const totalOrder = await orderModel.estimatedDocumentCount()
        const totalReviews = await reviewModel.estimatedDocumentCount()
        const totalContacts = await contactModel.estimatedDocumentCount()
        const analytics = {
            users: totalUser,
            orders: totalOrder,
            reviews: totalReviews,
            contacts: totalContacts

        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: analytics
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getRecentOrdersReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const reviews = await reviewModel.find().sort({ createdAt: -1 }).limit(10)
        const orders = await orderModel.find().sort({ createdAt: -1 }).select("+name  +transaction_id  +products_price  +products_quantity  +contact_email").limit(10)

        const analytics = {
            reviews,
            orders
        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: analytics
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const analyticsController = {
    getTotalCreatedData,
    getRecentOrdersReviews

}

export default analyticsController