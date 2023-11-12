"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncError_middlerware_1 = __importDefault(require("../middleware/asyncError.middlerware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = __importDefault(require("../models/order.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const getEmailMarketingData = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailMarketingData = yield order_model_1.default.find({ "promotions.email": { $exists: true } }).select("promotions.email name");
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: emailMarketingData
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getPhoneMarketingData = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneMarketingData = yield order_model_1.default.find({ "promotions.phone_number": { $exists: true } }).select("promotions.phone_number name");
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: phoneMarketingData
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const marketingController = {
    getEmailMarketingData,
    getPhoneMarketingData
};
exports.default = marketingController;
