import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import httpStatus from "http-status";
import orderModel, { IOrder } from "../models/order.model";
import sendResponse from "../utils/sendResponse";
import productModel from "../models/product.model";
import Stripe from "stripe";
import config from "../config";
import catchAsync from "../middleware/asyncError.middleware";
const stripe = new Stripe(config.payment_secret || "", {
  apiVersion: "2023-10-16",
});

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData = req.body;
      // console.log(orderData)
      // if (orderData?.payment_info) {
      //   if ("id" in orderData?.payment_info) {
      //     const paymentIntentId = orderData?.payment_info?.id;
      //     const paymentIntent = await stripe.paymentIntents.retrieve(
      //       paymentIntentId
      //     );
      //     if (paymentIntent.status !== "succeeded") {
      //       return next(
      //         new ErrorHandler(
      //           "payment not authorized!",
      //           httpStatus.BAD_GATEWAY
      //         )
      //       );
      //     }
      //   }
      // }

      const productId = orderData.product_id as string;
      console.log(38, orderData.products_quantity)
      const newOrder = {
        order_type: orderData.order_type,
        name: orderData.name,
        product_id: orderData.product_id,
        transaction_id: orderData.transaction_id,
        products_price: orderData.products_price,
        products_quantity: orderData.products_quantity,
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
      const product = await productModel.findById(productId);

      if (product?.quantity) {
        const productQuantity = product?.quantity;
        if (productQuantity > 0) {
          product.quantity = product?.quantity - 1;
          product.already_sell = product.already_sell + 1;

          if (product.quantity === 0) {
            product.product_status = "out of stock";
          }

          await product.save();
        } else {
          return next(
            new ErrorHandler(
              "This product is out of stock",
              httpStatus.BAD_REQUEST
            )
          );
        }
      } else {
        return next(
          new ErrorHandler(
            "This product is out of stock",
            httpStatus.BAD_REQUEST
          )
        );
      }

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "order added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);

// only admin
const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params?.id;
      const status = req.body?.order_status;

      if (!status) {
        return next(
          new ErrorHandler("status is required", httpStatus.BAD_REQUEST)
        );
      }
      const statusOptions = [
        "pending",
        "processing",
        "placed order",
        "completed",
      ];
      if (!statusOptions.includes(status)) {
        return next(new ErrorHandler("invalid status", httpStatus.BAD_REQUEST));
      }

      await orderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            order_status: status,
          },
        },
        { new: true }
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "order status updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);
// only admin
const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params?.id;
      await orderModel.findByIdAndDelete(orderId);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "order deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);
const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderModel.find().sort({ createdAt: -1 });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);

const getOrdersByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req?.query?.email

      if (!email) return next(new ErrorHandler("email is required", httpStatus.BAD_REQUEST))
      const orders = await orderModel.find({ email }).select("name order_status email delivery_info.address createdAt").sort({ createdAt: -1 });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);



// payments

const newPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const amount = req.body?.amount;
      console.log(amount);
      if (!amount)
        return next(
          new ErrorHandler("amount is required", httpStatus.BAD_REQUEST)
        );
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: {
          client_secret: paymentIntent.client_secret,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);

// const newSubscribe = catchAsync(async (req, res, next) => {
//     try {
//         const { name, email, paymentMethod } = req.body;

//         const customer = await stripe.customers.create({
//             email,
//             name,
//             payment_method: paymentMethod,
//             invoice_settings: { default_payment_method: paymentMethod },
//         });

//         const product = await stripe.products.create({
//             name: "Yearly subscription",
//         });

//         const subscription = await stripe.subscriptions.create({
//             customer: customer.id,
//             items: [
//                 {
//                     price_data: {
//                         currency: "USD",
//                         product: product.id,
//                         unit_amount: 500,
//                         recurring: {
//                             interval: "year",
//                         },
//                     },
//                 },
//             ],
//             payment_settings: {
//                 payment_method_types: ["card"],
//                 save_default_payment_method: "on_subscription",
//             },
//             expand: ["latest_invoice.payment_intent"],
//         });

//         const clientSecret = subscription?.latest_invoice?.payment_intent?.client_secret;

//         if (!clientSecret) {
//             throw new Error('Client secret not found in the subscription');
//         }

//         res.json({
//             message: "Subscription successfully initiated",
//             clientSecret,
//         });
//     } catch (error: any) {
//         console.error(error);
//         return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
//     }
// });
const newSubscribe = catchAsync(async (req, res, next) => {
  const { name, email, paymentMethod, amount } = req.body;

  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });

    // Create a product
    const product = await stripe.products.create({
      name: "Your Product Name",
    });

    // Create a subscription
    const subscription: any = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "USD",
            product: product.id,
            unit_amount: amount,
            recurring: {
              interval: "year",
            },
          },
        },
      ],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const clientSecret =
      subscription?.latest_invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      throw new Error("Client secret not found in the subscription");
    }
    const subscriptionId = subscription.id;
    res.json({
      message: "Subscription successfully initiated ssss",
      clientSecret,
      customer: customer.id,
      subscriptionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
const unsubscribe = catchAsync(async (req, res, next) => {
  const { subscriptionId } = req.body;
  console.log(subscriptionId);

  try {
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionId,

    );

    if (canceledSubscription.status === 'canceled') {
      res.json({ message: "Unsubscription successful", canceledSubscription });
    } else {
      res.status(400).json({ error: "Subscription cancellation failed" });
    }
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Server error" });
  }
});


const orderController = {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrders,
  getOrdersByEmail,
  newPayment,
  newSubscribe,
  unsubscribe,
};

export default orderController;