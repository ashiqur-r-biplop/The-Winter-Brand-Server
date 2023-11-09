import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../middleware/asyncError.middlerware";
import productModel from "../models/product.model";


const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productModel.find()
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: products
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const productController = {
    getProducts
}

export default productController