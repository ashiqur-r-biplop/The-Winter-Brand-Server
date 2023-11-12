import { NextFunction, Request, Response } from "express"
import catchAsync from "../middleware/asyncError.middlerware"
import layoutModel from "../models/layout.model"
import ErrorHandler from "../utils/ErrorHandler"
import sendResponse from "../utils/sendResponse"
import httpStatus from "http-status"

const createLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body as any
        const typeAlredyExits = await layoutModel.findOne({ type })

        if (typeAlredyExits) {
            if (type === "FAQ") {
                const { faq } = req.body as any
                const updatedFaqs = [
                    ...typeAlredyExits.faqs,
                    { index: typeAlredyExits.faqs.length + 1, ...faq, }
                ]
                await layoutModel.findByIdAndUpdate(typeAlredyExits._id, { faqs: updatedFaqs })
            }
            else if (type === "FEATURED_IMAGE") {
                const { image_url } = req.body as any

                const updatedImages = [
                    ...typeAlredyExits.featured_images,
                    { image_url }
                ]
                await layoutModel.findByIdAndUpdate(typeAlredyExits._id, { featured_images: updatedImages })
            }

        } else {
            if (type === "FAQ") {
                const { faq } = req.body as any
                await layoutModel.create({ type: "FAQ", faqs: { index: 1, ...faq } })
            }
            else if (type === "FEATURED_IMAGE") {
                const { image_url } = req.body as any
                await layoutModel.create({ type: "FEATURED_IMAGE", featured_images: { image_url } })
            }

            else {
                return next(new ErrorHandler(`${type} is not valid type`, 400))
            }
        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Layout added successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})
const deleteLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, id } = req.query

        if (!type || !id) return next(new ErrorHandler("type and id required", httpStatus.BAD_REQUEST))

        const typeAlredyExits = await layoutModel.findOne({ type })

        if (typeAlredyExits) {
            if (type === "FAQ") {
                const filterDeleteFaq = typeAlredyExits.faqs.filter(faq => faq._id.toString() !== id)
                await layoutModel.findByIdAndUpdate(typeAlredyExits._id, { faqs: filterDeleteFaq })
            }
            else if (type === "FEATURED_IMAGE") {

                const filterDeleteFeaturedImages = typeAlredyExits.featured_images.filter(image => image._id.toString() !== id)
                await layoutModel.findByIdAndUpdate(typeAlredyExits._id, { featured_images: filterDeleteFeaturedImages })
            }

        } else {
            return next(new ErrorHandler(`${type} is not valid type`, 400))

        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: `${type} Layout deleted successfully`
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

const deleteMultipleFeaturedImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { images_id } = req.body
        console.log(images_id)

        if (!images_id) return next(new ErrorHandler("images id required", httpStatus.BAD_REQUEST))

        const typeAlredyExits = await layoutModel.findOne({ type: "FEATURED_IMAGE" })

        if (typeAlredyExits) {
            const filterDeleteFeaturedImages = typeAlredyExits.featured_images.filter(image => !images_id.includes(image._id.toString()))
            await layoutModel.findByIdAndUpdate(typeAlredyExits._id, { featured_images: filterDeleteFeaturedImages })
        }
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: `FEATURED IMAGE Layout deleted successfully`
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})



const layoutController = {
    createLayout,
    deleteLayout,
    deleteMultipleFeaturedImages
}

export default layoutController