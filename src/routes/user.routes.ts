import express from "express"
import userController from "../controllers/user.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const userRouter = express.Router()


userRouter.post("/user-registration", userController.createUser)
userRouter.post("/login-user", userController.loginUser)
userRouter.get("/get-all-users", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.getAllUsers)
userRouter.get("/get-user-role/:email", isAuthenticated, userController.getUserRole)
userRouter.get("/logout", isAuthenticated, userController.logout)

export default userRouter