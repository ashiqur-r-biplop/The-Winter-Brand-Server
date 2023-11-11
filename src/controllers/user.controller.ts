import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import httpStatus from "http-status"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import userModel, { IUser } from "../models/user.model"
import config from "../config"
import { nodeCache } from "../app"
import sendToken, { accessTokenOption, refreshTokenOption } from "../utils/jwt"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as IUser
        const newUserData = {
            name: userData.name,
            email: userData.email,
        }

        await userModel.create(newUserData)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user created successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})



const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find()
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            data: users
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})
const getUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params?.email as string

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        const isCachedUser = nodeCache.has(`user:${email}`)
        if (isCachedUser) {
            const cachedUser = nodeCache.get(`user:${email}`)
            const user = JSON.parse(cachedUser as string)
            return sendResponse(res, {
                success: true,
                statusCode: httpStatus.CREATED,
                data: {
                    role: user.role
                }
            })
        } else {
            const user = await userModel.findOne({ email })
            if (user) {
                nodeCache.set(`user:${user.email}`, JSON.stringify(user))
                return sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.CREATED,
                    data: {
                        role: user.role
                    }
                })
            } else {
                return next(new ErrorHandler("invalid email", httpStatus.UNAUTHORIZED))
            }
        }

    } catch (error: any) {

        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

interface ILoginRequest {
    email: string;
}

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as ILoginRequest

        if (!email) {
            return next(new ErrorHandler("plase enter email", httpStatus.BAD_REQUEST))
        }

        const user = await userModel.findOne({ email })


        if (!user) {
            return next(new ErrorHandler("Invalid email and password", httpStatus.BAD_REQUEST))
        }

        sendToken(user, httpStatus.OK, res)



    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query?.email

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        nodeCache.del(`user:${email}`)
        res.cookie("access_token", "", { maxAge: 1 })
        res.cookie("refresh_token", "", { maxAge: 1 })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "logout successfully"
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})






const userController = {
    createUser,
    getAllUsers,
    getUserRole,
    loginUser,
    logout
}

export default userController