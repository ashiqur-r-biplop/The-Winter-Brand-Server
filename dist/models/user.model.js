"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    avater: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "super_admin"]
    },
}, { timestamps: true });
const userModel = mongoose_1.default.model("user", userSchema);
exports.default = userModel;
