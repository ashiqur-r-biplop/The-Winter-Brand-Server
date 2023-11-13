import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import contactModel, { IContact } from "../models/contact.model"
import sendResponse from "../utils/sendResponse"
import cartModel, { ICart } from "../models/cart.model"

const createCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cartData = req.body as ICart
        const newCart = {
            product_name: cartData.product_name,
            price: cartData.price,
            product_image: cartData.product_image,
            email: cartData.email
        }

        await cartModel.create(newCart)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const updateCartQuantity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        if (!data?.id || !data?.type) return next(new ErrorHandler("id and quantity update type is required", httpStatus.BAD_REQUEST))

        const type = data.type === "inc" ? 1 : -1
        await cartModel.findByIdAndUpdate(data.id, {
            $inc: {
                quantity: type
            }
        })


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart quantity update successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const getCartByEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params?.email
        if (!email) return next(new ErrorHandler("email is required", httpStatus.BAD_REQUEST))

        const carts = await cartModel.find({ email })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: carts
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const deleteCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id
        if (!id) return next(new ErrorHandler("id is required", httpStatus.BAD_REQUEST))

        await cartModel.findByIdAndDelete(id)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "cart deleted successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const cartController = {
    createCart,
    updateCartQuantity,
    getCartByEmail,
    deleteCart
}

export default cartController