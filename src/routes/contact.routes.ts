import express from "express"
import contactController from "../controllers/contact.controller"

const contactRouter = express.Router()

contactRouter.post("/create-contact", contactController.createContact)
contactRouter.get("/get-all-contacts", contactController.getAllContacts)

export default contactRouter