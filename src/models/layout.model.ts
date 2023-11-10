import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaq extends Document {
    question: string;
    body: string
}
// TODO featured image
export interface IFeaturedImagw extends Document {
    // image_url
}

export interface ILayout extends Document {
    type: string;
    faqs: IFaq[];
    featured_images: IFeaturedImagw[]
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
})




const faqModel: Model<IFaq> = mongoose.model("faq", FaqSchema)

export default faqModel