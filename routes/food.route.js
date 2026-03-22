import express from "express";

const router = express.Router();

import foodController from "../controllers/food.controller.js";
import auth from "../middlewares/auth.js";

router.use(auth);
router.post("/", foodController.createFood);
router.get("/", foodController.getAllFood);
router.patch("/:id/use", foodController.updateFoodUsage);

export default router;