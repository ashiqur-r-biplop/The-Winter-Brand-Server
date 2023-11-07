import express from "express"
import productController from "../controllers/product.controller"

const productRouter = express.Router()

productRouter.get("/products", productController.getProducts)

export default productRouter