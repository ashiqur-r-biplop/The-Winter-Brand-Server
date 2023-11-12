import express from "express"
import layoutController from "../controllers/layout.controller"

const layoutRouter = express.Router()

layoutRouter.post("/create-layout", layoutController.createLayout)
layoutRouter.delete("/delete-multiple-images", layoutController.deleteMultipleFeaturedImages)
layoutRouter.delete("/delete-layout", layoutController.deleteLayout)

export default layoutRouter