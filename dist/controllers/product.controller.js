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
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const asyncError_middlerware_1 = __importDefault(require("../middleware/asyncError.middlerware"));
const product_model_1 = __importDefault(require("../models/product.model"));
// only admin 
const createProduct = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = req.body;
        const newProduct = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        };
        yield product_model_1.default.create(newProduct);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "product created successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
// admin only 
const updateProduct = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
        const productData = req.body;
        const updatedProductData = {
            product_name: productData.product_name,
            product_description: productData.product_description,
            price: productData.price,
            discount: productData.discount || null,
            product_image: productData.product_image,
            quantity: productData.quantity,
        };
        yield product_model_1.default.findByIdAndUpdate(id, {
            $set: updatedProductData
        }, { new: true });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "product updated successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const deleteProduct = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const productId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
        yield product_model_1.default.findByIdAndDelete(productId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "product deleted successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getProducts = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: products
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const productController = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts
};
exports.default = productController;
