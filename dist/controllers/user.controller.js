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
const http_status_1 = __importDefault(require("http-status"));
const asyncError_middlerware_1 = __importDefault(require("../middleware/asyncError.middlerware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const user_model_1 = __importDefault(require("../models/user.model"));
const app_1 = require("../app");
const jwt_1 = __importDefault(require("../utils/jwt"));
const createUser = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const newUserData = {
            name: userData.name,
            email: userData.email,
        };
        yield user_model_1.default.create(newUserData);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "user created successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getAllUsers = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            data: users
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const getUserRole = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.params) === null || _a === void 0 ? void 0 : _a.email;
        if (!email)
            return next(new ErrorHandler_1.default("email is require in query", http_status_1.default.BAD_REQUEST));
        const isCachedUser = app_1.nodeCache.has(`user:${email}`);
        if (isCachedUser) {
            const cachedUser = app_1.nodeCache.get(`user:${email}`);
            const user = JSON.parse(cachedUser);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.CREATED,
                data: {
                    role: user.role
                }
            });
        }
        else {
            const user = yield user_model_1.default.findOne({ email });
            if (user) {
                app_1.nodeCache.set(`user:${user.email}`, JSON.stringify(user));
                return (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.CREATED,
                    data: {
                        role: user.role
                    }
                });
            }
            else {
                return next(new ErrorHandler_1.default("invalid email", http_status_1.default.UNAUTHORIZED));
            }
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const loginUser = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new ErrorHandler_1.default("plase enter email", http_status_1.default.BAD_REQUEST));
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email and password", http_status_1.default.BAD_REQUEST));
        }
        (0, jwt_1.default)(user, http_status_1.default.OK, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const logout = (0, asyncError_middlerware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const email = (_b = req.query) === null || _b === void 0 ? void 0 : _b.email;
        if (!email)
            return next(new ErrorHandler_1.default("email is require in query", http_status_1.default.BAD_REQUEST));
        app_1.nodeCache.del(`user:${email}`);
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.CREATED,
            message: "logout successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, http_status_1.default.BAD_REQUEST));
    }
}));
const userController = {
    createUser,
    getAllUsers,
    getUserRole,
    loginUser,
    logout
};
exports.default = userController;
