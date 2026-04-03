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
 *           example: "Daging"
 *         total_amount:
 *           type: number
 *           description: Total berat (expired + discarded) dalam satuan unitOfWeight
 *           example: 1.50
 *         unit_of_weight:
 *           type: string
 *           description: Satuan berat. "-" jika tidak tersedia.
 *           example: "kg"
 *         total_price:
 *           type: number
 *           description: Total kerugian finansial
 *           example: 26250.00
 *         percentage:
 *           type: number
 *           description: Persentase kerugian kategori ini dari total semua kerugian
 *           example: 75.00
 *     CategoryLossListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get category loss summary"
 *         data:
 *           type: array
 *           description: Diurutkan descending berdasarkan total_price
 *           items:
 *             $ref: '#/components/schemas/CategoryLoss'
 *     CategoryLossMonthly:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           example: "2026-03"
 *         categories:
 *           type: array
 *           description: Diurutkan descending berdasarkan total_price
 *           items:
 *             $ref: '#/components/schemas/CategoryLoss'
 *     CategoryLossMonthlyListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get category loss summary per month"
 *         data:
 *           type: array
 *           description: Diurutkan ascending berdasarkan month
 *           items:
 *             $ref: '#/components/schemas/CategoryLossMonthly'
 *     EfficiencyScore:
 *       type: object
 *       properties:
 *         last_month:
 *           type: number
 *           description: Total nilai discard bulan lalu
 *           example: 35000
 *         current_month:
 *           type: number
 *           description: Total nilai discard bulan ini
 *           example: 17500
 *         efficiency_score:
 *           type: number
 *           description: "Rumus: ((last - current) / last) * 100. Bernilai 0 jika last_month = 0."
 *           example: 50.00
 *     EfficiencyScoreResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get efficiency score"
 *         data:
 *           $ref: '#/components/schemas/EfficiencyScore'
 *     DiscardHistory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "daging ayam"
 *         category:
 *           type: string
 *           description: Nama kategori food. "Unknown" jika tidak memiliki kategori.
 *           example: "Daging"
 *         discarded_date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-29T10:00:00.000Z"
 *         amount:
 *           type: number
 *           description: Jumlah yang dibuang
 *           example: 0.5
 *         unit_of_weight:
 *           type: string
 *           example: "kg"
 *         total_loss:
 *           type: number
 *           description: Total kerugian (amount x price_of_unit)
 *           example: 8750
 *     DiscardHistoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get discarded history"
 *         data:
 *           type: array
 *           description: Diurutkan descending berdasarkan discarded_date
 *           items:
 *             $ref: '#/components/schemas/DiscardHistory'
 */

/**
 * @swagger
 * /waste/category_loss:
 *   get:
 *     summary: Get total loss per category (gabungan expired food + discarded foodLog)
 *     description: Menggabungkan data food dengan status "expired" dan foodLog dengan status "discarded". Diurutkan descending berdasarkan total_price.
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category loss summary berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryLossListResponse'
 *             example:
 *               success: true
 *               message: "Success get category loss summary"
 *               data:
 *                 - category: "Daging"
 *                   total_amount: 1.50
 *                   unit_of_weight: "kg"
 *                   total_price: 26250.00
 *                   percentage: 75.00
 *                 - category: "Sayur"
 *                   total_amount: 0.50
 *                   unit_of_weight: "kg"
 *                   total_price: 8750.00
 *                   percentage: 25.00
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
router.get("/category_loss", wasteTrackerController.getCategoryLossSummary)

/**
 * @swagger
 * /waste/category_loss_month:
 *   get:
 *     summary: Get category loss per bulan
 *     description: Data diurutkan ascending berdasarkan bulan. Di dalam tiap bulan, kategori diurutkan descending berdasarkan total_price.
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category loss per bulan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryLossMonthlyListResponse'
 *             example:
 *               success: true
 *               message: "Success get category loss summary per month"
 *               data:
 *                 - month: "2026-03"
 *                   categories:
 *                     - category: "Daging"
 *                       total_amount: 1.50
 *                       unit_of_weight: "kg"
 *                       total_price: 26250.00
 *                       percentage: 75.00
 *                     - category: "Sayur"
 *                       total_amount: 0.50
 *                       unit_of_weight: "kg"
 *                       total_price: 8750.00
 *                       percentage: 25.00
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
router.get("/category_loss_month", wasteTrackerController.getCategoryLossPerMonth)

/**
 * @swagger
 * /waste/efficiency_score:
 *   get:
 *     summary: Get efficiency score perbandingan discard bulan ini vs bulan lalu
 *     description: "Efficiency score dihitung dari: ((last_month - current_month) / last_month) * 100. Bernilai 0 jika last_month = 0. Nilai positif berarti lebih efisien dari bulan lalu."
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Efficiency score berhasil dihitung
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EfficiencyScoreResponse'
 *             example:
 *               success: true
 *               message: "Success get efficiency score"
 *               data:
 *                 last_month: 35000
 *                 current_month: 17500
 *                 efficiency_score: 50.00
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
router.get("/efficiency_score", wasteTrackerController.getEfficiencyScore)

/**
 * @swagger
 * /waste/discard_history:
 *   get:
 *     summary: Get riwayat discard food
 *     description: Menampilkan semua food log dengan status "discarded" milik user. Diurutkan descending berdasarkan discarded_date. Field category bernilai "Unknown" jika food tidak memiliki kategori.
 *     tags: [Waste Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat discard berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscardHistoryListResponse'
 *             example:
 *               success: true
 *               message: "Success get discarded history"
 *               data:
 *                 - name: "daging ayam"
 *                   category: "Daging"
 *                   discarded_date: "2026-03-29T10:00:00.000Z"
 *                   amount: 0.5
 *                   unit_of_weight: "kg"
 *                   total_loss: 8750
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
router.get("/discard_history", wasteTrackerController.getDiscardedHistory)

export default router