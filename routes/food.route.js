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
 *     FoodData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         foodCategoryId:
 *           type: integer
 *           example: 2
 *         foodName:
 *           type: string
 *           example: "daging ayam"
 *         initialWeight:
 *           type: number
 *           example: 2
 *         currentWeight:
 *           type: number
 *           example: 2
 *         unitOfWeight:
 *           type: string
 *           example: "kg"
 *         storageLocation:
 *           type: string
 *           example: "Kulkas Bawah"
 *         purchaseDate:
 *           type: string
 *           format: date
 *           example: "2026-03-28"
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-04-04T00:00:00.000Z"
 *         price:
 *           type: number
 *           nullable: true
 *           example: 35000
 *         priceOfUnit:
 *           type: number
 *           nullable: true
 *           example: 17500
 *         status:
 *           type: string
 *           enum: [fresh, warning, expired, consumed]
 *           example: "fresh"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FoodResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/FoodData'
 *     FoodListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         food_category_id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: "daging ayam"
 *         current_weight:
 *           type: number
 *           example: 2
 *         unit_weight:
 *           type: string
 *           example: "kg"
 *         purchase_date:
 *           type: string
 *           format: date-time
 *           example: "2026-03-28T00:00:00.000Z"
 *         expiry_date:
 *           type: string
 *           format: date-time
 *           example: "2026-04-04T00:00:00.000Z"
 *         days_left:
 *           type: integer
 *           example: 7
 *         total_price:
 *           type: number
 *           example: 35000
 *         storage_location:
 *           type: string
 *           example: "Kulkas Bawah"
 *         risk_score:
 *           type: number
 *           example: 5000.00
 *     FoodListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get all food"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodListItem'
 *     RiskRankingItem:
 *       type: object
 *       properties:
 *         food_name:
 *           type: string
 *           example: "daging ayam"
 *         current_weight:
 *           type: number
 *           example: 2
 *         unit_of_weight:
 *           type: string
 *           example: "kg"
 *         price_of_unit:
 *           type: number
 *           example: 17500
 *         days_left:
 *           type: integer
 *           example: 2
 *         risk_score:
 *           type: number
 *           example: 17500.00
 *     RiskRankingListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Success get risk ranking"
 *         data:
 *           type: array
 *           description: Diurutkan descending berdasarkan risk_score. Hanya food dengan status fresh atau warning.
 *           items:
 *             $ref: '#/components/schemas/RiskRankingItem'
 *     FoodUsageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Food usage recorded successfully"
 *         data:
 *           type: object
 *           properties:
 *             food_id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "daging ayam"
 *             used_weight:
 *               type: number
 *               example: 0.5
 *             remaining_weight:
 *               type: number
 *               example: 1.5
 *             status:
 *               type: string
 *               example: "fresh"
 *     FoodDiscardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Food discarded successfully"
 *         data:
 *           type: object
 *           properties:
 *             food_id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "daging ayam"
 *             discarded_weight:
 *               type: number
 *               example: 0.5
 *             remaining_weight:
 *               type: number
 *               example: 1.5
 *             status:
 *               type: string
 *               example: "fresh"
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
 *     summary: Create food baru (expiry date diprediksi oleh AI)
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
 *                 description: Opsional. Total harga pembelian.
 *     responses:
 *       201:
 *         description: Food berhasil dibuat, expiry date di-generate oleh AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 *             example:
 *               success: true
 *               message: "Food created successfully"
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 foodCategoryId: 1
 *                 foodName: "daging ayam"
 *                 initialWeight: 2
 *                 currentWeight: 2
 *                 unitOfWeight: "kg"
 *                 storageLocation: "Kulkas Bawah"
 *                 purchaseDate: "2026-03-28"
 *                 expiryDate: "2026-04-04T00:00:00.000Z"
 *                 price: 35000
 *                 priceOfUnit: 17500
 *                 status: "fresh"
 *       400:
 *         description: Validasi input gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Ada field wajib yang kosong
 *                 value:
 *                   success: false
 *                   message: "All required fields must be filled"
 *               futureDate:
 *                 summary: Purchase date di masa depan
 *                 value:
 *                   success: false
 *                   message: "Purchase date cannot be in the future"
 *               invalidWeight:
 *                 summary: Initial weight tidak valid
 *                 value:
 *                   success: false
 *                   message: "Invalid initial weight"
 *               invalidFoodInput:
 *                 summary: Input food tidak valid menurut AI
 *                 value:
 *                   success: false
 *                   message: "Invalid food input"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       404:
 *         description: Category tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Category not found"
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
router.post("/", foodController.createFood)

/**
 * @swagger
 * /food:
 *   get:
 *     summary: Get semua food milik user yang sedang login
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List semua food milik user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodListResponse'
 *             example:
 *               success: true
 *               message: "Success get all food"
 *               data:
 *                 - id: 1
 *                   food_category_id: 1
 *                   name: "daging ayam"
 *                   current_weight: 2
 *                   unit_weight: "kg"
 *                   purchase_date: "2026-03-28T00:00:00.000Z"
 *                   expiry_date: "2026-04-04T00:00:00.000Z"
 *                   days_left: 7
 *                   total_price: 35000
 *                   storage_location: "Kulkas Bawah"
 *                   risk_score: 5000.00
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
router.get("/", foodController.getAllFood)

/**
 * @swagger
 * /food/risk_ranking_panel:
 *   get:
 *     summary: Get risk ranking panel - food diurutkan berdasarkan risk score tertinggi
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Risk ranking data (hanya food dengan status fresh atau warning). Jika kosong, data array empty.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RiskRankingListResponse'
 *             example:
 *               success: true
 *               message: "Success get risk ranking"
 *               data:
 *                 - food_name: "daging ayam"
 *                   current_weight: 2
 *                   unit_of_weight: "kg"
 *                   price_of_unit: 17500
 *                   days_left: 2
 *                   risk_score: 17500.00
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
router.get("/risk_ranking_panel", foodController.getRiskRankingPanel)

/**
 * @swagger
 * /food/{id}:
 *   get:
 *     summary: Get detail food berdasarkan ID (hanya milik user sendiri)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food ID
 *     responses:
 *       200:
 *         description: Detail food (raw DB object)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodResponse'
 *             example:
 *               success: true
 *               message: "Success get food detail"
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 foodCategoryId: 1
 *                 foodName: "daging ayam"
 *                 initialWeight: 2
 *                 currentWeight: 1.5
 *                 unitOfWeight: "kg"
 *                 storageLocation: "Kulkas Bawah"
 *                 purchaseDate: "2026-03-28"
 *                 expiryDate: "2026-04-04T00:00:00.000Z"
 *                 price: 35000
 *                 priceOfUnit: 17500
 *                 status: "fresh"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       404:
 *         description: Food tidak ditemukan (atau bukan milik user ini)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Food not found"
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
router.get("/:id", foodController.getDetailFood)

/**
 * @swagger
 * /food/{id}/use:
 *   patch:
 *     summary: Catat penggunaan food (mengurangi current weight)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food ID
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
 *                 example: 0.5
 *                 description: Jumlah yang digunakan, harus lebih dari 0
 *     responses:
 *       200:
 *         description: Penggunaan food berhasil dicatat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodUsageResponse'
 *             example:
 *               success: true
 *               message: "Food usage recorded successfully"
 *               data:
 *                 food_id: 1
 *                 name: "daging ayam"
 *                 used_weight: 0.5
 *                 remaining_weight: 1.5
 *                 status: "fresh"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               invalidWeight:
 *                 summary: used_weight tidak valid
 *                 value:
 *                   success: false
 *                   message: "used_weight must be greater than 0"
 *               stockNotEnough:
 *                 summary: used_weight melebihi stok
 *                 value:
 *                   success: false
 *                   message: "Stock not enough. Available: 1.5"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       404:
 *         description: Food tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Food not found"
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
router.patch("/:id/use", foodController.updateFoodUsage)

/**
 * @swagger
 * /food/{id}/discard:
 *   patch:
 *     summary: Buang/discard food (mengurangi current weight, dicatat sebagai discarded)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food ID
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
 *                 example: 0.5
 *                 description: Jumlah yang dibuang, harus lebih dari 0
 *     responses:
 *       200:
 *         description: Food berhasil di-discard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodDiscardResponse'
 *             example:
 *               success: true
 *               message: "Food discarded successfully"
 *               data:
 *                 food_id: 1
 *                 name: "daging ayam"
 *                 discarded_weight: 0.5
 *                 remaining_weight: 1.5
 *                 status: "fresh"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               invalidWeight:
 *                 summary: discarded_weight tidak valid
 *                 value:
 *                   success: false
 *                   message: "discarded_weight must be greater than 0"
 *               stockEmpty:
 *                 summary: Stok sudah kosong
 *                 value:
 *                   success: false
 *                   message: "Stock is already empty"
 *               stockNotEnough:
 *                 summary: discarded_weight melebihi stok
 *                 value:
 *                   success: false
 *                   message: "Stock not enough. Available: 1.5"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       404:
 *         description: Food tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Food not found"
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
router.patch("/:id/discard", foodController.discardFood)

/**
 * @swagger
 * /food/{id}:
 *   delete:
 *     summary: Hapus food beserta semua food log terkait
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food ID
 *     responses:
 *       200:
 *         description: Food berhasil dihapus (tanpa data di response body)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseSuccessResponse'
 *             example:
 *               success: true
 *               message: "Food deleted successfully"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       404:
 *         description: Food tidak ditemukan (atau bukan milik user ini)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Food not found"
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
router.delete("/:id", foodController.deleteFood)

export default router