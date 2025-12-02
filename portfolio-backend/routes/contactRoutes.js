import express from "express";
import {createContact,getContacts} from "../controllers/contact.js";

const router = express.Router();

router.post("/contact", createContact);
router.get("/contact", getContacts);

export default router;
