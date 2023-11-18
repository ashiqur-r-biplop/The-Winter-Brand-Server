import express from "express"
import cartController from "../controllers/cart.controller"
import { isAuthenticated } from "../middleware/auth.middleware"

const cartRouter = express.Router()
cartRouter.post("/create-cart", isAuthenticated, cartController.createCart)
cartRouter.put("/update-cart-product-quantity", isAuthenticated, cartController.updateCartQuantity)
cartRouter.get("/get-cart/:email", isAuthenticated, cartController.getCartByEmail)
cartRouter.get("/get-cart-is-exist", isAuthenticated, cartController.getIsCartExistByEmail)
cartRouter.delete("/delete-cart/:id", isAuthenticated, cartController.deleteCart)

export default cartRouter