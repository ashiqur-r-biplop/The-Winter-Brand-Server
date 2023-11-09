import express from "express"
import orderController from "../controllers/order.controller"

const orderRouter = express.Router()

orderRouter.post("/create-order", orderController.createOrder)


export default orderRouter