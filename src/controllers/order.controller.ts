import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import orderModel, { IOrder } from "../models/order.model"
import sendResponse from "../utils/sendResponse"

const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderData = req.body as IOrder
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

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "order added successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})


const orderController = {
    createOrder
}

export default orderController