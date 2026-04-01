import express from "express" 
const router = express.Router() 

import wasteTrackerController from "../controllers/wasteTracker.controller.js" 
import auth from "../middlewares/auth.js" 

router.use(auth) 

/**
 * @swagger
 * tags:
 *   name: Waste Tracker
 *   description: Waste analytics and efficiency tracking
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryLoss:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *         total_price:
 *           type: number
 *         percentage:
 *           type: number
 *     CategoryLossListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryLoss'
 *     CategoryLossMonthly:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: 2026-03
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryLoss'
 *     CategoryLossMonthlyListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryLossMonthly'
 *     EfficiencyScore:
 *       type: object
 *       properties:
 *         last_month:
 *           type: number
 *         current_month:
 *           type: number
 *         efficiency_score:
 *           type: number
 *     EfficiencyScoreResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/EfficiencyScore'
 *     DiscardHistory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         discarded_date:
 *           type: string
 *           format: date
 *         amount:
 *           type: number
 *         unit_of_weight:
 *           type: string
 *         total_loss:
 *           type: number
 *     DiscardHistoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DiscardHistory'
 */

/**
 * @swagger
 * /waste/category_loss:
 *   get:
 *     summary: Get total loss per category
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category loss summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryLossListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Terjadi kesalahan interupsi pada server backend"
 */
router.get("/category_loss", wasteTrackerController.getCategoryLossSummary)

/**
 * @swagger
 * /waste/category_loss_month:
 *   get:
 *     summary: Get category loss per month
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly category loss
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryLossMonthlyListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Terjadi kesalahan interupsi pada server backend"
 */
router.get("/category_loss_month", wasteTrackerController.getCategoryLossPerMonth)

/**
 * @swagger
 * /waste/efficiency_score:
 *   get:
 *     summary: Get efficiency score
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Efficiency score result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EfficiencyScoreResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Terjadi kesalahan interupsi pada server backend"
 */
router.get("/efficiency_score", wasteTrackerController.getEfficiencyScore)

/**
 * @swagger
 * /waste/discard_history:
 *   get:
 *     summary: Get discard history
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discard history list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscardHistoryListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Terjadi kesalahan interupsi pada server backend"
 */
router.get("/discard_history", wasteTrackerController.getDiscardedHistory)

export default router