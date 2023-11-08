import { NextFunction, Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import httpStatus from "http-status"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import userModel, { IUser } from "../models/user.model"
import config from "../config"

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

// const updateAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authorization = req.headers.authorization
//         if (!authorization) {
//             return res.status(401).send({ error: true, message: "unauthorized access" })
//         }

//         const token = authorization.split(' ')[1]
//         jwt.verify(token, config.jwt.secret as Secret, (error, decoded) => {
//             if (error) {
//                 return res.status(401).send({ error: true, message: "unauthorized access" })
//             }
//             req.user = decoded
//             next()
//         })


//         const message = "could not get refresh token"
//         if (!decoded) {
//             return next(new ErrorHandler(message, httpStatus.BAD_REQUEST))
//         }



//         const user = JSON.parse(session)
//         const new_access_token = jwt.sign({ id: user._id }, config.jwt.secret as string, {
//             expiresIn: "5m"
//         })
//         const new_refresh_token = jwt.sign({ id: user._id }, config.jwt.refresh_secret as string, {
//             expiresIn: "3d"
//         })




//         req.user = user

//         res.cookie("access_token", new_access_token, accessTokenOption)
//         res.cookie("refresh_token", new_refresh_token, refreshTokenOption)

//         sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             data: { new_access_token }
//         })

//     }
//     catch (error: any) {
//         return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))

//     }
// })

const userController = {
    createUser
}

export default userController