import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    order_type: "payment" | "subscription" | "cart",
    name: string;
    product_id: string;
    order_status: string;
    transaction_id: string;
    products_price: number;
    products_quantity: number;
    company?: string;
    contact_email: string
    delivery_info: {
        country: string;
        state: string;
        address: string;
        postcode: number;
        city: string;
        phone: string;
        apartment?: string;
    },
    promotions?: {
        phone_number?: string;
        email?: string;
    }
}


const OrderSchema = new Schema<IOrder>({
    order_type: {
        type: String,
        required: [true, "order type is required"],
        enum: ["payment", "subscription", "cart"]
    },
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
        required: [true, "products price  is required"]
    },
    products_quantity: {
        type: Number,
        required: [true, "products quantity is required"]
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
        phone: {
            type: String,
            required: [true, "phone is required"],
        },
        apartment: {
            type: String
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
}, { timestamps: true })

const orderModel: Model<IOrder> = mongoose.model("order", OrderSchema)

export default orderModel