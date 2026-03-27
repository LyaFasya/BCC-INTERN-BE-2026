import express from "express" 

const router = express.Router() 

import wasteTrackerController from "../controllers/wasteTracker.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 
router.get("/category_loss", wasteTrackerController.getCategoryLossSummary) 
router.get("/category_loss_month", wasteTrackerController.getCategoryLossPerMonth) 
router.get("/efficiency_score", wasteTrackerController.getEfficiencyScore) 
router.get("/discard_history", wasteTrackerController.getDiscardedHistory) 

export default router 