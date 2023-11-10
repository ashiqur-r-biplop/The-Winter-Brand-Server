import mongoose, { Document, Model, Mongoose, Schema } from "mongoose";

export interface IFaq extends Document {
    index: number;
    question: string;
    body: string
}
// TODO featured image
export interface IFeaturedImagw extends Document {
    image_url: string
}

export interface ILayout extends Document {
    type: string;
    faqs: IFaq[];
    featured_images: IFeaturedImagw[]
}

const FaqSchema: Schema<IFaq> = new mongoose.Schema({
    question: String,
    body: String,
})


const LayoutSchema: Schema<ILayout> = new mongoose.Schema({

}, { timestamps: true })

const faqModel: Model<IFaq> = mongoose.model("faq", FaqSchema)

export default faqModel