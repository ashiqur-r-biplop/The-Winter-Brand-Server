import express from "express"
import orderController from "../controllers/order.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const orderRouter = express.Router()

orderRouter.post("/create-order", orderController.createOrder)
orderRouter.put("/update-order-status/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.updateOrderStatus)
orderRouter.delete("/delete-order/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.deleteOrder)
orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getOrders)


export default orderRouter