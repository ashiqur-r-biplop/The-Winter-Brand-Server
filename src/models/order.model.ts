import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    name: string;
    product_id: string;
    company?: string;
    contact_email: string
    delivery_info: {
        country: string;
        state: string;
        address: string;
        postcode: number;
        city: string;
    },
    promotions?: {
        phone_number?: string;
        email?: string;
    }
}


const OrderSchema: Schema<IOrder> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    product_id: {
        type: String,
        required: [true, "product id is required"]
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
            default: null
        },
        email: {
            type: String,
            default: null
        },
    }
}, { timestamps: true })

const orderModel: Model<IOrder> = mongoose.model("order", OrderSchema)

export default orderModel