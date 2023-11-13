import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    rating: number;
    name: string;
    review: string;
    email: string;
}

const ReviewSchema = new Schema<IReview>({
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
    }
}, { timestamps: true })


const reviewModel: Model<IReview> = mongoose.model("review", ReviewSchema)

export default reviewModel