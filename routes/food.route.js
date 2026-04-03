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
 *           properties:
 *             id:
 *               type: integer
 *             foodName:
 *               type: string
 *             foodCategoryId:
 *               type: integer
 *             initialWeight:
 *               type: number
 *             currentWeight:
 *               type: number
 *             unitOfWeight:
 *               type: string
 *             storageLocation:
 *               type: string
 *             purchaseDate:
 *               type: string
 *               format: date-time
 *             expiryDate:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *             price:
 *               type: number
 *             priceOfUnit:
 *               type: number
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
 *             properties:
 *               id:
 *                 type: integer
 *               food_category_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               current_weight:
 *                 type: number
 *               unit_weight:
 *                 type: string
 *               purchase_date:
 *                 type: string
 *                 format: date-time
 *               expiry_date:
 *                 type: string
 *                 format: date-time
 *               days_left:
 *                 type: integer
 *               total_price:
 *                 type: number
 *               storage_location:
 *                 type: string
 *               risk_score:
 *                 type: number
 *     RiskRankingListResponse:
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
 *             properties:
 *               food_name:
 *                 type: string
 *               current_weight:
 *                 type: number
 *               unit_of_weight:
 *                 type: string
 *               price_of_unit:
 *                 type: number
 *               days_left:
 *                 type: integer
 *               risk_score:
 *                 type: number
 *     FoodUsageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             food_id:
 *               type: integer
 *             name:
 *               type: string
 *             used_weight:
 *               type: number
 *             remaining_weight:
 *               type: number
 *             status:
 *               type: string
 *     FoodDiscardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             food_id:
 *               type: integer
 *             name:
 *               type: string
 *             discarded_weight:
 *               type: number
 *             remaining_weight:
 *               type: number
 *             status:
 *               type: string
 *     BaseSuccessResponse:
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
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Validasi input gagal atau parameter tidak lengkap"
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
 *               $ref: '#/components/schemas/RiskRankingListResponse'
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Data referensi tidak ditemukan di sistem"
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
 *               $ref: '#/components/schemas/FoodUsageResponse'
 *       400:
 *         description: Bad request (e.g. usage exceeds available weight)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Data referensi tidak ditemukan di sistem"
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
 *               $ref: '#/components/schemas/FoodDiscardResponse'
 *       400:
 *         description: Bad request (e.g. discard exceeds available weight)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Data referensi tidak ditemukan di sistem"
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
 *               $ref: '#/components/schemas/BaseSuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akses ditolak: Token tidak valid atau kadaluarsa"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Data referensi tidak ditemukan di sistem"
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
router.delete("/:id", foodController.deleteFood)

export default router