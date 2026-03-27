import express from "express" 

const router = express.Router() 

import foodStatusController from "../controllers/foodStatus.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 
router.get("/consumed", foodStatusController.getConsumedStatusPerMonth) 
router.get("/discarded", foodStatusController.getDiscardedStatusPerMonth) 
router.get("/warning", foodStatusController.getWarningStatusPerMonth) 
router.get("/expired", foodStatusController.getExpiredStatusPerMonth) 
router.get("/fresh", foodStatusController.getFreshStatusPerMonth) 

export default router 