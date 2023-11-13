"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const orderRouter = express_1.default.Router();
// orderRouter.post("/create-order", orderController.createOrder)
// orderRouter.post("/payment", orderController.newPayment)
// orderRouter.post("/subscribe", orderController.newSubscribe)
// orderRouter.put("/update-order-status/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.updateOrderStatus)
// orderRouter.delete("/delete-order/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.deleteOrder)
// orderRouter.get("/get-orders", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), orderController.getOrders)
orderRouter.post("/create-order", order_controller_1.default.createOrder);
// orderRouter.post("/payment", orderController.newPayment)
// orderRouter.post("/subscribe", orderController.newSubscribe)
orderRouter.put("/update-order-status/:id", order_controller_1.default.updateOrderStatus);
orderRouter.delete("/delete-order/:id", order_controller_1.default.deleteOrder);
orderRouter.get("/get-orders", order_controller_1.default.getOrders);
exports.default = orderRouter;
