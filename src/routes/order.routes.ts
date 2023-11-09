import express from "express"
import orderController from "../controllers/order.controller"

const orderRouter = express.Router()

orderRouter.post("/create-order", orderController.createOrder)
orderRouter.put("/update-order-status/:id", orderController.updateOrderStatus)
orderRouter.delete("/delete-order/:id", orderController.deleteOrder)
orderRouter.get("/get-orders", orderController.getOrders)


export default orderRouter