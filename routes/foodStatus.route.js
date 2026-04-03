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
 *     ConsumedMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         consumed_percentage:
 *           type: number
 *         consumed_count:
 *           type: integer
 *         total_price:
 *           type: number
 *     DiscardedMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         discarded_percentage:
 *           type: number
 *         discarded_count:
 *           type: integer
 *         total_price:
 *           type: number
 *     WarningMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         warning_percentage:
 *           type: number
 *         warning_count:
 *           type: integer
 *         total_price:
 *           type: number
 *     ExpiredMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         expired_percentage:
 *           type: number
 *         expired_count:
 *           type: integer
 *         total_price:
 *           type: number
 *     FreshMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         fresh_percentage:
 *           type: number
 *         fresh_count:
 *           type: integer
 *         total_price:
 *           type: number
 *     BaseListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
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
 *             type: object
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
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseListResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ConsumedMonthlyStatus'
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
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseListResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DiscardedMonthlyStatus'
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
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseListResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WarningMonthlyStatus'
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
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseListResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ExpiredMonthlyStatus'
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
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseListResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FreshMonthlyStatus'
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
router.get("/fresh", foodStatusController.getFreshStatusPerMonth)

export default router