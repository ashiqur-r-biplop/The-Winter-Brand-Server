import mongoose, { Document, Model, Schema } from "mongoose";


interface IProduct extends Document {

}


const ProductSchema: Schema<IProduct> = new mongoose.Schema({}, { timestamps: true })

const ProductModel: Model<IProduct> = mongoose.model("product", ProductSchema)