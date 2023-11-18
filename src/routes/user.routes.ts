import express from "express"
import userController from "../controllers/user.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const userRouter = express.Router()

userRouter.post("/user-registration", userController.createUser)
userRouter.post("/login-user", userController.loginUser)
userRouter.put("/update-user-profile", isAuthenticated, userController.updateUserProfile)
userRouter.get("/get-user-role/:email", isAuthenticated, userController.getUserRole)
userRouter.get("/get-user-profile/:email", isAuthenticated, userController.getProfileByEmail)
userRouter.get("/logout", isAuthenticated, userController.logout)
// only admin 
userRouter.put("/update-user-role", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.updateUserRole)
userRouter.get("/search-users/:query", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.searchUsers)
userRouter.get("/get-all-users", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), userController.getAllUsers)


export default userRouter