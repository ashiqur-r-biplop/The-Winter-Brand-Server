import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    firebaseUId: string;
    avater?: {
        url: string
    }
    role?: string;
}


const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    firebaseUId: {
        type: String,
        required: [true, "Firebase id is required"]
    },
    avater: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "super_admin"]
    },
}, { timestamps: true })

const userModel: Model<IUser> = mongoose.model("user", userSchema)

export default userModel
