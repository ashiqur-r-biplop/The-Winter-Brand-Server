import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import ErrorHandler from "../utils/ErrorHandler"
import httpStatus from "http-status"
import sendResponse from "../utils/sendResponse"
import userModel, { IUser } from "../models/user.model"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as IUser
        const newUserData = {
            name: userData.name,
            email: userData.email
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


const userController = {
    createUser
}

export default userController