"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const reviewModel = mongoose_1.default.model("review", ReviewSchema);
exports.default = reviewModel;
