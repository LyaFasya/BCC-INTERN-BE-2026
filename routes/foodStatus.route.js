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
 *           example: "2026-03"
 *         consumed_percentage:
 *           type: number
 *           description: Persentase consumed dari total food aktifitas bulan itu
 *           example: 75.00
 *         consumed_count:
 *           type: integer
 *           description: Jumlah food log dengan status consumed
 *           example: 3
 *         total_price:
 *           type: number
 *           description: Total harga (amount x price_of_unit dari food log)
 *           example: 52500
 *     DiscardedMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "2026-03"
 *         discarded_percentage:
 *           type: number
 *           description: Persentase discarded dari total food aktifitas bulan itu
 *           example: 25.00
 *         discarded_count:
 *           type: integer
 *           description: Jumlah food log dengan status discarded
 *           example: 1
 *         total_price:
 *           type: number
 *           description: Total harga (amount x price_of_unit dari food log)
 *           example: 17500
 *     WarningMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "2026-03"
 *         warning_percentage:
 *           type: number
 *           description: Persentase food warning dari total food bulan itu
 *           example: 33.33
 *         warning_count:
 *           type: integer
 *           description: Jumlah food dengan status warning
 *           example: 2
 *         total_price:
 *           type: number
 *           description: Total harga (current_weight x price_of_unit dari food)
 *           example: 35000
 *     ExpiredMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "2026-03"
 *         expired_percentage:
 *           type: number
 *           description: Persentase food expired dari total food bulan itu
 *           example: 10.00
 *         expired_count:
 *           type: integer
 *           description: Jumlah food dengan status expired
 *           example: 1
 *         total_price:
 *           type: number
 *           description: Total harga (current_weight x price_of_unit dari food)
 *           example: 12000
 *     FreshMonthlyStatus:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "2026-03"
 *         fresh_percentage:
 *           type: number
 *           description: Persentase food fresh dari total food bulan itu
 *           example: 56.67
 *         fresh_count:
 *           type: integer
 *           description: Jumlah food dengan status fresh
 *           example: 5
 *         total_price:
 *           type: number
 *           description: Total harga (current_weight x price_of_unit dari food)
 *           example: 87500
 *     BaseListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /food-status/consumed:
 *   get:
 *     summary: Get statistik consumed food per bulan
 *     description: Data diambil dari foodLog dengan status "consumed". Diurutkan ascending berdasarkan bulan.
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik consumed food per bulan berhasil diambil
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
 *             example:
 *               success: true
 *               message: "Success get consumed monthly dashboard"
 *               data:
 *                 - month: "2026-03"
 *                   consumed_percentage: 75.00
 *                   consumed_count: 3
 *                   total_price: 52500
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/consumed", foodStatusController.getConsumedStatusPerMonth)

/**
 * @swagger
 * /food-status/discarded:
 *   get:
 *     summary: Get statistik discarded food per bulan
 *     description: Data diambil dari foodLog dengan status "discarded". Diurutkan ascending berdasarkan bulan.
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik discarded food per bulan berhasil diambil
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
 *             example:
 *               success: true
 *               message: "Success get discarded monthly dashboard"
 *               data:
 *                 - month: "2026-03"
 *                   discarded_percentage: 25.00
 *                   discarded_count: 1
 *                   total_price: 17500
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/discarded", foodStatusController.getDiscardedStatusPerMonth)

/**
 * @swagger
 * /food-status/warning:
 *   get:
 *     summary: Get statistik warning food per bulan
 *     description: Data diambil dari food model dengan status "warning" (bukan dari foodLog). Diurutkan ascending berdasarkan bulan.
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik warning food per bulan berhasil diambil
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
 *             example:
 *               success: true
 *               message: "Success get warning monthly dashboard"
 *               data:
 *                 - month: "2026-03"
 *                   warning_percentage: 33.33
 *                   warning_count: 2
 *                   total_price: 35000
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/warning", foodStatusController.getWarningStatusPerMonth)

/**
 * @swagger
 * /food-status/expired:
 *   get:
 *     summary: Get statistik expired food per bulan
 *     description: Data diambil dari food model dengan status "expired" (bukan dari foodLog). Diurutkan ascending berdasarkan bulan.
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik expired food per bulan berhasil diambil
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
 *             example:
 *               success: true
 *               message: "Success get expired monthly dashboard"
 *               data:
 *                 - month: "2026-03"
 *                   expired_percentage: 10.00
 *                   expired_count: 1
 *                   total_price: 12000
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/expired", foodStatusController.getExpiredStatusPerMonth)

/**
 * @swagger
 * /food-status/fresh:
 *   get:
 *     summary: Get statistik fresh food per bulan
 *     description: Data diambil dari food model dengan status "fresh" (bukan dari foodLog). Diurutkan ascending berdasarkan bulan.
 *     tags: [Food Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik fresh food per bulan berhasil diambil
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
 *             example:
 *               success: true
 *               message: "Success get fresh monthly dashboard"
 *               data:
 *                 - month: "2026-03"
 *                   fresh_percentage: 56.67
 *                   fresh_count: 5
 *                   total_price: 87500
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/fresh", foodStatusController.getFreshStatusPerMonth)

export default router