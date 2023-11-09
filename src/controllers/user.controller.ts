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
            firebaseUId: userData.firebaseUId,
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

const updateAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies?.refresh_token as string
        const decoded = jwt.verify(refresh_token, config.jwt.refresh_secret as string) as JwtPayload
        const message = "could not get refresh token"
        if (!decoded) {
            return next(new ErrorHandler(message, httpStatus.BAD_REQUEST))
        }

        const session = nodeCache.get("user:" + decoded?.email as string)
        if (!session) {
            return next(new ErrorHandler(message, httpStatus.BAD_REQUEST))
        }
        console.log(session)
        const user = JSON.parse(session)
        const new_access_token = jwt.sign({ id: user._id }, config.jwt.secret as string, {
            expiresIn: "5m"
        })
        const new_refresh_token = jwt.sign({ id: user._id }, config.jwt.refresh_secret as string, {
            expiresIn: "3d"
        })

        req.user = user

        res.cookie("access_token", new_access_token, accessTokenOption)
        res.cookie("refresh_token", new_refresh_token, refreshTokenOption)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            data: { new_access_token }
        })

    }
    catch (error: any) {
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
        const email = req.query?.email

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        const cachedUser = nodeCache.get(`user:${email}`) as string
        if (cachedUser) {

            const user = JSON.parse(cachedUser)
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



        else {
            const newUser = await userModel.findOne({ email })
            if (newUser) {
                sendToken(newUser, httpStatus.OK, res)
            }
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
    }
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query?.email

        if (!email) return next(new ErrorHandler("email is require in query", httpStatus.BAD_REQUEST))
        nodeCache.del(`user:${email}`)

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
    updateAccessToken,
    getAllUsers,
    getUserRole,
    loginUser,
    logout
}

export default userController