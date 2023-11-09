import mongoose, { Document, Model, Schema } from "mongoose";


interface IProduct extends Document {
    product_name: string;
    product_description: string;
    price: number;
    discount?: number | null;
    product_image: string;
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
    quantity: {
        type: Number,
        required: [true, "Product Quantity is required"]
    }

}, { timestamps: true })

const ProductModel: Model<IProduct> = mongoose.model("product", ProductSchema)