import express from "express"
import userController from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post("/user-registration", userController.createUser)

export default userRouter