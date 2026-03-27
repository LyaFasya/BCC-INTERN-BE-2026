import express from "express" 

const router = express.Router() 

import foodController from "../controllers/food.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 
router.post("/", foodController.createFood) 
router.get("/", foodController.getAllFood)
router.get("/risk_ranking_panel", foodController.getRiskRankingPanel) 
router.get("/:id", foodController.getDetailFood)
router.patch("/:id/use", foodController.updateFoodUsage) 
router.patch("/:id/discard", foodController.discardFood) 

export default router 