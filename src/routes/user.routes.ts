import express from "express"
import userController from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post("/user-registration", userController.createUser)
userRouter.get("/get-all-users", userController.getAllUsers)
userRouter.get("/get-user-role", userController.getUserRole)
userRouter.get("/logout", userController.logout)

export default userRouter