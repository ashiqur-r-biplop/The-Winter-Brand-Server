import { NextFunction, Request, Response } from "express";
import catchAsync from "../middleware/asyncError.middleware";
import ErrorHandler from "../utils/ErrorHandler";
import httpStatus from "http-status";
import sendResponse from "../utils/sendResponse";
import orderModel from "../models/order.model";
import productModel from "../models/product.model";
import { ObjectId } from "mongodb";
import cartModel from "../models/cart.model";


const addOrder = catchAsync(async (orderData: any, res: Response, next: NextFunction) => {
    try {
        if (orderData.order_type === "payment" || orderData.order_type === "subscription") {
            if (!orderData?.packages) return next(new ErrorHandler("packages data required", httpStatus.BAD_REQUEST))
            if (orderData.order_type === "payment") {
                if (!orderData.transaction_id) return next(new ErrorHandler("transaction id is required", httpStatus.BAD_REQUEST))
            }
            if (orderData.order_type === "subscription") {
                if (!orderData.subscription_id) return next(new ErrorHandler("subscription id is required", httpStatus.BAD_REQUEST))
            }


            const newOrder = {
                order_type: orderData.order_type,
                name: orderData.name,
                transaction_id: orderData.transaction_id,
                subscription_id: orderData.subscription_id,
                company: orderData.company,
                contact_email: orderData.contact_email,
                email: orderData.email,
                packages: {
                    type: orderData.packages.type,
                    gender: orderData.packages.gender,
                    size: orderData.packages.size,
                    selected: orderData.packages.selected,
                    package: orderData.packages.package,
                },
                delivery_info: {
                    country: orderData.delivery_info.country,
                    state: orderData.delivery_info.state,
                    address: orderData.delivery_info.address,
                    postcode: orderData.delivery_info.postcode,
                    city: orderData.delivery_info.city,
                    phone: orderData.delivery_info.phone,
                    apartment: orderData?.apartment
                },
                promotions: {
                    phone_number: orderData?.promotions?.phone_number,
                    email: orderData?.promotions?.email,
                },
            };

            await orderModel.create(newOrder);

            if (orderData.order_type === "subscription") {
                sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.CREATED,
                    message: "subscription successfully",
                });
            }
            if (orderData.order_type === "payment") {
                sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.CREATED,
                    message: "order successfully",
                });
            }

        }
        else if (orderData.order_type === "cart") {
            if (!orderData?.products) return next(new ErrorHandler("product data is required", httpStatus.BAD_REQUEST))
            if (!orderData?.cart_ids) return next(new ErrorHandler("cart ids is required", httpStatus.BAD_REQUEST))


            const updatedProducts = await Promise.all(
                orderData.products.map(async ({ id, quantity }: { id: string; quantity: number }) => {
                    return productModel.findByIdAndUpdate(
                        id,
                        { $inc: { quantity: -quantity, already_sell: quantity } },
                        { new: true }
                    );
                })
            );

            if (updatedProducts) {
                const query = { _id: { $in: orderData.cart_ids.map((id: string) => new ObjectId(id)) } }
                await cartModel.deleteMany(query)
            }

            const newOrder = {
                order_type: orderData.order_type,
                name: orderData.name,
                products: orderData?.products,
                transaction_id: orderData.transaction_id,
                company: orderData.company,
                contact_email: orderData.contact_email,
                email: orderData.email,
                delivery_info: {
                    country: orderData.delivery_info.country,
                    state: orderData.delivery_info.state,
                    address: orderData.delivery_info.address,
                    postcode: orderData.delivery_info.postcode,
                    city: orderData.delivery_info.city,
                    phone: orderData.delivery_info.phone,
                    apartment: orderData?.apartment
                },
                promotions: {
                    phone_number: orderData?.promotions?.phone_number,
                    email: orderData?.promotions?.email,
                },
            };

            await orderModel.create(newOrder);

            // products.forEach(product => {
            //     if (product?.quantity) {
            //         const productQuantity = product?.quantity;
            //         if (productQuantity > 0) {
            //             product.quantity = product?.quantity - 1;
            //             product.already_sell = product.already_sell + 1;

            //             if (product.quantity === 0) {
            //                 product.product_status = "out of stock";
            //             }


            //         } else {
            //             return next(
            //                 new ErrorHandler(
            //                     "This product is out of stock",
            //                     httpStatus.BAD_REQUEST
            //                 )
            //             );
            //         }
            //     } else {
            //         return next(
            //             new ErrorHandler(
            //                 "This product is out of stock",
            //                 httpStatus.BAD_REQUEST
            //             )
            //         );
            //     }
            // })

            // await products.save();


            sendResponse(res, {
                success: true,
                statusCode: httpStatus.CREATED,
                message: "order added successfully",
                data: updatedProducts
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

export default addOrder