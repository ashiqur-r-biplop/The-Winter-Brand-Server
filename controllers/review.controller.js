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
const review_model_1 = __importDefault(require("../models/review.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const createReview = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewData = req.body;
        const newReview = {
            rating: reviewData.rating,
            name: reviewData.name,
            review: reviewData.review,
            email: reviewData.email
        };
        yield review_model_1.default.create(newReview);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: 'review successfully added'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const updateReviewStatus = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.id;
        yield review_model_1.default.findByIdAndUpdate(reviewId, {
            $set: {
                status: "approved"
            }
        }, { new: true });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: 'review status updated successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getAllReviews = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const reviewType = (_a = req.query) === null || _a === void 0 ? void 0 : _a.type;
        let reviews;
        if (reviewType) {
            reviews = yield review_model_1.default.find({ status: reviewType }).sort({ createdAt: -1 });
        }
        else {
            reviews = yield review_model_1.default.find();
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: reviews
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getReviews = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const reviewsLimit = parseInt((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit);
        const sort = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sort) === "des" ? -1 : 1;
        let reviews;
        if (reviewsLimit && sort) {
            reviews = yield review_model_1.default.find({ status: "approved" }).sort({ createdAt: sort }).limit(reviewsLimit);
        }
        else if (reviewsLimit) {
            reviews = yield review_model_1.default.find({ status: "approved" }).limit(reviewsLimit);
        }
        else {
            reviews = yield review_model_1.default.find({ status: "approved" });
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            data: reviews
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const deleteReview = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const reviewId = (_d = req.params) === null || _d === void 0 ? void 0 : _d.id;
        yield review_model_1.default.findByIdAndDelete(reviewId);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "review deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const reviewController = {
    createReview,
    updateReviewStatus,
    getAllReviews,
    getReviews,
    deleteReview
};
exports.default = reviewController;
