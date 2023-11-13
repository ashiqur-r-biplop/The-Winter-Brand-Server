import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICart extends Document {
    product_name: string;
    price: number;
    quantity: number;
    product_image: string;
}

const CartSchema = new Schema<ICart>({
    product_name: {
        type: String,
        required: [true, "product name is required"]
    },
    price: {
        type: Number,
        required: [true, "price name is required"]
    },
    quantity: {
        type: Number,
        default: 1

    },
    product_image: {
        type: String,
        required: [true, "product_image name is required"]
    },

})

const cartModel: Model<ICart> = mongoose.model("cart", CartSchema)

export default cartModel