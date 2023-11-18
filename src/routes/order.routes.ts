import express from "express"
import orderController from "../controllers/order.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const orderRouter = express.Router()

orderRouter.post("/create-order", isAuthenticated, orderController.createOrder)
orderRouter.post("/payment", isAuthenticated, orderController.newPayment)
orderRouter.post("/subscribe", isAuthenticated, orderController.newSubscribe)
orderRouter.post("/unsubscribe", isAuthenticated, orderController.unsubscribe)
orderRouter.get("/get-orders-by-email", isAuthenticated, orderController.getOrdersByEmail)
orderRouter.get("/get-invoice/:id", isAuthenticated, orderController.getInvoiceById)
// only admin 
orderRouter.delete("/delete-order/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.deleteOrder)
orderRouter.put("/update-order-status", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.updateOrderStatus)
orderRouter.get("/search-orders/:query", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.searchOrders)
orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getOrders)
orderRouter.get("/get-order/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getSingleOrder)


export default orderRouter