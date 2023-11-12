"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    product_id: {
        type: String,
        required: [true, "product id is required"]
    },
    order_status: {
        type: String,
        default: "pending",
        enum: ["pending", "processing", "placed order", "completed"]
    },
    transaction_id: {
        type: String,
        required: [true, "transaction id is required"]
    },
    products_price: {
        type: Number,
        required: [true, "products price id is required"]
    },
    products_quantity: {
        type: Number,
        required: [true, "products quantity id is required"]
    },
    company: {
        type: String,
        default: null
    },
    contact_email: {
        type: String,
        required: [true, "contact email is required"]
    },
    delivery_info: {
        country: {
            type: String,
            required: [true, "country is required"],
        },
        state: {
            type: String,
            required: [true, "state is required"],
        },
        address: {
            type: String,
            required: [true, "address is required"],
        },
        postcode: {
            type: String,
            required: [true, "postcode is required"],
        },
        city: {
            type: String,
            required: [true, "city is required"],
        },
    },
    promotions: {
        phone_number: {
            type: String,
        },
        email: {
            type: String,
        },
    }
}, { timestamps: true });
const orderModel = mongoose_1.default.model("order", OrderSchema);
exports.default = orderModel;
