import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import httpStatus from "http-status"
import config from "./config"
import errorHandlerMiddleware from "./middleware/errorHandler.middleware"
import productRouter from "./routes/product.routes"
import userRouter from "./routes/user.routes"
import reviewRouter from "./routes/review.routes"
import orderRouter from "./routes/order.routes"

export const app: Application = express()

app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(cors({
    origin: config.origin
}))



app.use("/api/v1", productRouter, userRouter, reviewRouter, orderRouter)
app.get("/test", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Api is working"
    })
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = httpStatus.NOT_FOUND
    next(err)
})

app.use(errorHandlerMiddleware)