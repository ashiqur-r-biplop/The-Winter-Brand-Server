"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    need: {
        type: Date,
        required: [true, "Time is required"]
    },
    message: {
        type: String,
        required: [true, "message is required"]
    },
}, { timestamps: true });
const contactModel = mongoose_1.default.model("contact", contactSchema);
exports.default = contactModel;
