import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    rating: number;
    name: string;
    review: string;
    email: string;
    status: string;
}

const ReviewSchema: Schema<IReview> = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, "rating is required"]
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
    review: {
        type: String,
        required: [true, "review is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved"]
    },
}, { timestamps: true })


const reviewModel: Model<IReview> = mongoose.model("review", ReviewSchema)

export default reviewModel