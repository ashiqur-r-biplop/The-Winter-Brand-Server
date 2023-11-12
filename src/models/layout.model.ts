import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFaq extends Document {
    question: string;
    body: string
}

export interface IFeaturedImage extends Document {
    image_url: string
}

export interface ILayout extends Document {
    type: string;
    faqs: IFaq[];
    featured_images: IFeaturedImage[]
}

const FaqSchema = new Schema<IFaq>({
    question: String,
    body: String,
})

const FeaturedImageSchema = new Schema<IFeaturedImage>({
    image_url: String
})


const LayoutSchema = new Schema<ILayout>({
    type: String,
    faqs: [FaqSchema],
    featured_images: [FeaturedImageSchema],
}, { timestamps: true })

const layoutModel: Model<ILayout> = mongoose.model("layout", LayoutSchema)

export default layoutModel
