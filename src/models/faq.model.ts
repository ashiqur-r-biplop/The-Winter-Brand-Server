import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaq extends Document {
    question: string;
    body: string
}
const FaqSchema: Schema<IFaq> = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    body: {
        type: String,
        required: [true, "Body is required"]
    }
}, { timestamps: true })


const faqModel: Model<IFaq> = mongoose.model("faq", FaqSchema)

export default faqModel