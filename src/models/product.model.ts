import mongoose, { Document, Model, Schema } from "mongoose";


export interface IProduct extends Document {
    product_name: string;
    product_description: string;
    product_status?: string;
    price: number;
    discount?: number | null;
    product_image: string;
    already_sell: number;
    quantity: number;
}


const ProductSchema: Schema<IProduct> = new mongoose.Schema({
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

}, { timestamps: true })

const productModel: Model<IProduct> = mongoose.model("product", ProductSchema)
export default productModel