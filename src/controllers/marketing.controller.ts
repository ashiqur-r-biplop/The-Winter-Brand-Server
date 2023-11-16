import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middleware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import orderModel from "../models/order.model"
import sendResponse from "../utils/sendResponse"

const getEmailMarketingData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emailMarketingData = await orderModel.find({ "promotions.email": { $type: "string" } }).select("promotions.email name")

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: emailMarketingData
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getPhoneMarketingData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phoneMarketingData = await orderModel.find({ "promotions.phone_number": { $type: "string" } }).select("promotions.phone_number name")

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            data: phoneMarketingData
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const marketingController = {
    getEmailMarketingData,
    getPhoneMarketingData
}
export default marketingController