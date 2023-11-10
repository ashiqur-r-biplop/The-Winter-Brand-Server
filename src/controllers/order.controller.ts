import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import orderModel, { IOrder } from "../models/order.model"
import sendResponse from "../utils/sendResponse"
import productModel from "../models/product.model"

const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderData = req.body as IOrder
        const productId = orderData.product_id as string
        const newOrder = {
            name: orderData.name,
            product_id: orderData.product_id,
            transaction_id: orderData.transaction_id,
            products_price: orderData.products_price,
            products_quantity: orderData.products_quantity,
            company: orderData.company,
            contact_email: orderData.contact_email,
            delivery_info: {
                country: orderData.delivery_info.country,
                state: orderData.delivery_info.state,
                address: orderData.delivery_info.address,
                postcode: orderData.delivery_info.postcode,
                city: orderData.delivery_info.city,
            },
            promotions: {
                phone_number: orderData?.promotions?.phone_number || "",
                email: orderData?.promotions?.email || ""
            },
        }

        await orderModel.create(newOrder)
        const product = await productModel.findById(productId)


        if (product?.quantity) {
            const productQuantity = product?.quantity
            if (productQuantity > 0) {
                product.quantity = product?.quantity - 1

                if (product.quantity === 0) {
                    product.product_status = "out of stock"
                }

                await product.save()
            } else {
                return next(new ErrorHandler("This product is out of stock", httpStatus.BAD_REQUEST))
            }
        } else {
            return next(new ErrorHandler("This product is out of stock", httpStatus.BAD_REQUEST))
        }



        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "order added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



// only admin 
const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params?.id
        const status = req.body?.order_status

        if (!status) {
            return next(new ErrorHandler("status is required", httpStatus.BAD_REQUEST))
        }
        const statusOptions = ["pending", "processing", "placed order", "completed"]
        if (!statusOptions.includes(status)) {
            return next(new ErrorHandler("invalid status", httpStatus.BAD_REQUEST))
        }

        await orderModel.findByIdAndUpdate(orderId, {
            $set: {
                order_status: status
            }
        }, { new: true })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "order status updated successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
// only admin 
const deleteOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params?.id
        await orderModel.findByIdAndDelete(orderId)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "order deleted successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: orders
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



const orderController = {
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrders
}

export default orderController