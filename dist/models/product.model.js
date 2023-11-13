"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    product_name: {
        type: String,
        required: [true, "Product name is required"]
    },
    product_description: {
        type: String,
        required: [true, "Product description is required"]
    },
    product_status: {
        type: String,
        default: "in stock",
        enum: ["in stock", "out of stock"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    discount: {
        type: Number,
        default: null
    },
    product_image: {
        type: String,
        required: [true, "Product thabnail is required"]
    },
    already_sell: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: [true, "Product Quantity is required"]
    }
}, { timestamps: true });
const productModel = mongoose_1.default.model("product", ProductSchema);
exports.default = productModel;
