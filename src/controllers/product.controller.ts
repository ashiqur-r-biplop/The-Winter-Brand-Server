import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../middleware/asyncError.middlerware";
import productModel, { IProduct } from "../models/product.model";


// only admin 
const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productData = req.body as IProduct
        const newProduct = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        }
        await productModel.create(newProduct)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "product created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
// admin only 
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id as string
        const productData = req.body as IProduct
        const updatedProductData = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        }
        await productModel.findByIdAndUpdate(id, {
            $set: updatedProductData
        }, { new: true })
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "product updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


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
    createProduct,
    updateProduct,
    getProducts
}

export default productController