import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../middleware/asyncError.middlerware";


const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "it's working"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const productController = {
    getProducts
}

export default productController