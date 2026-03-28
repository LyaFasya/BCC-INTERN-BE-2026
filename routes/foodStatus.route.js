import express from "express" 

const router = express.Router() 

import foodStatusController from "../controllers/foodStatus.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 

/**
 * @swagger
 * tags:
 *   name: Food Status
 *   description: Food status analytics per month
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: 2026-03
 *         percentage:
 *           type: number
 *           example: 0.25
 *         count:
 *           type: integer
 *           example: 5
 *         total_value:
 *           type: number
 *           example: 50000
 *     FoodStatusListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MonthlyStatus'
 */

/**
 * @swagger
 * /food-status/consumed:
 *   get:
 *     summary: Get consumed food status per month
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consumed food statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodStatusListResponse'
 */
router.get("/consumed", foodStatusController.getConsumedStatusPerMonth)

/**
 * @swagger
 * /food-status/discarded:
 *   get:
 *     summary: Get discarded food status per month
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discarded food statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodStatusListResponse'
 */
router.get("/discarded", foodStatusController.getDiscardedStatusPerMonth)

/**
 * @swagger
 * /food-status/warning:
 *   get:
 *     summary: Get warning food status per month
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warning food statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodStatusListResponse'
 */
router.get("/warning", foodStatusController.getWarningStatusPerMonth)

/**
 * @swagger
 * /food-status/expired:
 *   get:
 *     summary: Get expired food status per month
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired food statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodStatusListResponse'
 */
router.get("/expired", foodStatusController.getExpiredStatusPerMonth)

/**
 * @swagger
 * /food-status/fresh:
 *   get:
 *     summary: Get fresh food status per month
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fresh food statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodStatusListResponse'
 */
router.get("/fresh", foodStatusController.getFreshStatusPerMonth)

export default router