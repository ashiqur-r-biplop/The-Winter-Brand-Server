import express from "express"
import productController from "../controllers/product.controller"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.middleware"
import { USER_ROLE } from "../enum/userRole"

const productRouter = express.Router()

productRouter.post("/create-product", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.createProduct)
productRouter.put("/update-product/:id", isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), productController.updateProduct)
productRouter.get("/get-all-products", productController.getProducts)

export default productRouter