require("dotenv").config()
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import catchAsync from "./asyncError.middlerware";
import ErrorHandler from "../utils/ErrorHandler";

import httpStatus from "http-status"
import config from "../config";

export const isAuthenticated = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies?.access_token as string

    if (!access_token) {
        return next(new ErrorHandler("Please login", httpStatus.BAD_REQUEST))
    }

    const decoded = jwt.verify(access_token, config.jwt.secret as string) as JwtPayload
    if (!decoded) {
        return next(new ErrorHandler("access token is not valid", httpStatus.BAD_REQUEST))
    }






    // req.user = user
    next()
})


// export const authorizeRoles = (...roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!roles.includes(req.user?.role || "")) {
//             return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed`, httpStatus.BAD_REQUEST))
//         }
//         next()
//     }
// }