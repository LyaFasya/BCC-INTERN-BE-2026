import express from "express" 
const router = express.Router() 

import foodController from "../controllers/food.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Food management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     FoodListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /food:
 *   post:
 *     summary: Create food
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [food_category_id, food_name, initial_weight, unit_of_weight, storage_location, purchase_date]
 *             properties:
 *               food_category_id:
 *                 type: integer
 *                 example: 1
 *               food_name:
 *                 type: string
 *                 example: Daging Ayam
 *               initial_weight:
 *                 type: number
 *                 example: 2
 *               unit_of_weight:
 *                 type: string
 *                 example: kg
 *               storage_location:
 *                 type: string
 *                 example: Kulkas Bawah
 *               purchase_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-28
 *               price:
 *                 type: number
 *                 example: 35000
 *     responses:
 *       201:
 *         description: Food created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 */
router.post("/", foodController.createFood)

/**
 * @swagger
 * /food:
 *   get:
 *     summary: Get all food
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user food
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodListResponse'
 */
router.get("/", foodController.getAllFood)

/**
 * @swagger
 * /food/risk_ranking_panel:
 *   get:
 *     summary: Get risk ranking panel
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Risk ranking data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodListResponse'
 */
router.get("/risk_ranking_panel", foodController.getRiskRankingPanel)

/**
 * @swagger
 * /food/{id}:
 *   get:
 *     summary: Get food detail
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Food detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 */
router.get("/:id", foodController.getDetailFood)

/**
 * @swagger
 * /food/{id}/use:
 *   patch:
 *     summary: Update food usage
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [used_weight]
 *             properties:
 *               used_weight:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Food usage recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 */
router.patch("/:id/use", foodController.updateFoodUsage)

/**
 * @swagger
 * /food/{id}/discard:
 *   patch:
 *     summary: Discard food
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [discarded_weight]
 *             properties:
 *               discarded_weight:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Food discarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 */
router.patch("/:id/discard", foodController.discardFood)

/**
 * @swagger
 * /food/{id}:
 *   delete:
 *     summary: Delete food
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Food deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 */
router.delete("/:id", foodController.deleteFood)

export default router