import express from "express"
import userController from "../controllers/user.controller"
import { isAuthenticated } from "../middleware/auth.middleware"

const userRouter = express.Router()

userRouter.post("/user-registration", userController.createUser)
userRouter.post("/login-user", userController.loginUser)
userRouter.get("/update-token", userController.updateAccessToken)
userRouter.get("/get-all-users", userController.getAllUsers)
userRouter.get("/get-user-role", isAuthenticated, userController.getUserRole)
userRouter.get("/logout", userController.logout)

export default userRouter