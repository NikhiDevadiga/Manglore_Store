import express from "express";
import { submitMessage, getAllMessages, deleteMesseges } from "../Controller/contactusController.js";
import { getAddress, createAddress, deleteAddress } from "../Controller/addressController.js";

const router = express.Router();

router.post("/contact", submitMessage);
router.get("/admin/messages", getAllMessages);
router.delete('/admin/messages/:id',deleteMesseges);
//address routes
router.get('/address/:userId', getAddress);
router.post('/address/:userId', createAddress);
router.delete('/address/:userId/:addressId', deleteAddress);


export default router;
