"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncError_middlerware_1 = __importDefault(require("../middleware/asyncError.middlerware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = __importDefault(require("../models/order.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const product_model_1 = __importDefault(require("../models/product.model"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
const stripe = new stripe_1.default(config_1.default.payment_secret || "");
const createOrder = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const orderData = req.body;
        if (orderData === null || orderData === void 0 ? void 0 : orderData.payment_info) {
            if ("id" in (orderData === null || orderData === void 0 ? void 0 : orderData.payment_info)) {
                const paymentIntentId = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.payment_info) === null || _a === void 0 ? void 0 : _a.id;
                const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("payment not authorized!", http_status_1.default.BAD_GATEWAY));
                }
            }
        }
        const productId = orderData.product_id;
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
                phone_number: (_b = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _b === void 0 ? void 0 : _b.phone_number,
                email: (_c = orderData === null || orderData === void 0 ? void 0 : orderData.promotions) === null || _c === void 0 ? void 0 : _c.email
            },
        };
        yield order_model_1.default.create(newOrder);
        const product = yield product_model_1.default.findById(productId);
        if (product === null || product === void 0 ? void 0 : product.quantity) {
            const productQuantity = product === null || product === void 0 ? void 0 : product.quantity;
            if (productQuantity > 0) {
                product.quantity = (product === null || product === void 0 ? void 0 : product.quantity) - 1;
                if (product.quantity === 0) {
                    product.product_status = "out of stock";
                }
                yield product.save();
            }
            else {
                return next(new ErrorHandler_1.default("This product is out of stock", http_status_1.default.BAD_REQUEST));
            }
        }
        else {
            return next(new ErrorHandler_1.default("This product is out of stock", http_status_1.default.BAD_REQUEST));
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "order added successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// only admin 
const updateOrderStatus = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const orderId = (_d = req.params) === null || _d === void 0 ? void 0 : _d.id;
        const status = (_e = req.body) === null || _e === void 0 ? void 0 : _e.order_status;
        if (!status) {
            return next(new ErrorHandler_1.default("status is required", http_status_1.default.BAD_REQUEST));
        }
        const statusOptions = ["pending", "processing", "placed order", "completed"];
        if (!statusOptions.includes(status)) {
            return next(new ErrorHandler_1.default("invalid status", http_status_1.default.BAD_REQUEST));
        }
        yield order_model_1.default.findByIdAndUpdate(orderId, {
            $set: {
                order_status: status
            }
        }, { new: true });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "order status updated successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// only admin 
const deleteOrder = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const orderId = (_f = req.params) === null || _f === void 0 ? void 0 : _f.id;
        yield order_model_1.default.findByIdAndDelete(orderId);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "order deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getOrders = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find().sort({ createdAt: -1 });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: orders
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// payments 
// const newPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const amount = req.body?.amount
//         if (!amount) return next(new ErrorHandler("amount is required", httpStatus.BAD_REQUEST))
//         const payment = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: "usd",
//             payment_method_types: ['card']
//             // automatic_payment_methods: {
//             //     enabled: true
//             // }
//         })
//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.CREATED,
//             data: {
//                 client_secret: payment.client_secret
//             }
//         })
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
//     }
// })
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
const orderController = {
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrders,
    // newPayment,
    // newSubscribe
};
exports.default = orderController;
