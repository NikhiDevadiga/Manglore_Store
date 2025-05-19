import express from "express";
import { loginmodel,registrationmodel, getUser,getUserById, updateUser,forgotPassword,resetPassword } from "../Controller/userController.js";
import { adminlogin } from "../Controller/adminController.js";
import { getOrder, createOrder, getOrdersByUser} from "../Controller/orderController.js";

const router = express.Router();

router.post('/registration',registrationmodel)
router.post('/login',loginmodel)
router.get('/users/list',getUser)
router.get('/userlist/:id',getUserById)
router.put('/update/:id',updateUser)
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

// router.post('/adminregistration',adminregistration)
router.post('/adminlogin',adminlogin)

//
router.get('/admin/getorders',getOrder)
router.post('/admin/createOrders',createOrder)
router.get("/user/:id", getOrdersByUser);

export default router;