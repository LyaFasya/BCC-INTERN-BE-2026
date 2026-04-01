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
 *               example: 1
 *             food_name:
 *               type: string
 *               example: "Daging Ayam"
 *             food_category_id:
 *               type: integer
 *               example: 2
 *             initial_weight:
 *               type: number
 *               example: 2
 *             current_weight:
 *               type: number
 *               example: 1.5
 *             unit_of_weight:
 *               type: string
 *               example: "kg"
 *             storage_location:
 *               type: string
 *               example: "Kulkas Bawah"
 *             purchase_date:
 *               type: string
 *               example: "2026-03-25"
 *             expiry_date:
 *               type: string
 *               example: "2026-04-05"
 *             status:
 *               type: string
 *               example: "fresh"
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
 *                 example: 1
 *               food_name:
 *                 type: string
 *                 example: "Daging Ayam"
 *               current_weight:
 *                 type: number
 *                 example: 1.5
 *               unit_of_weight:
 *                 type: string
 *                 example: "kg"
 *               status:
 *                 type: string
 *                 example: "fresh"
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
 *               $ref: '#/components/schemas/FoodResponse'
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
 *               $ref: '#/components/schemas/FoodResponse'
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
router.delete("/:id", foodController.deleteFood)

export default router