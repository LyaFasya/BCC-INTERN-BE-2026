import express from "express"

const router = express.Router()

import category from "../controllers/category.controller.js"
import authenticate from "../middlewares/auth.js"
import checkRole from "../middlewares/checkRole.js"
import upload from "../middlewares/upload.js"

router.use(authenticate)

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Food Category API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         categoryName:
 *           type: string
 *           example: "Daging"
 *         categoryProfile:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/example/image.jpg"
 *         categoryPublicId:
 *           type: string
 *           nullable: true
 *           example: "categories/abc123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/CategoryData'
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryData'
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   categoryName: "Daging"
 *                   categoryProfile: "https://res.cloudinary.com/example/image.jpg"
 *                   categoryPublicId: "categories/abc123"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
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
router.get("/", category.getAllCategory)

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create category (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: Daging
 *               category_profile:
 *                 type: string
 *                 format: binary
 *                 description: Gambar kategori (opsional)
 *     responses:
 *       201:
 *         description: Category berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *             example:
 *               success: true
 *               message: "Category created"
 *               data:
 *                 id: 1
 *                 categoryName: "Daging"
 *                 categoryProfile: "https://res.cloudinary.com/example/image.jpg"
 *                 categoryPublicId: "categories/abc123"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               missingName:
 *                 summary: category_name tidak dikirim
 *                 value:
 *                   success: false
 *                   message: "Category name is required"
 *               alreadyExists:
 *                 summary: Nama kategori sudah ada
 *                 value:
 *                   success: false
 *                   message: "Category already exists"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       403:
 *         description: Forbidden - bukan admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Access denied"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               uploadFailed:
 *                 summary: Upload gambar gagal
 *                 value:
 *                   success: false
 *                   message: "Image upload failed"
 *               serverError:
 *                 summary: Error server umum
 *                 value:
 *                   success: false
 *                   message: "Internal server error"
 */
router.post("/", checkRole("admin"), upload.single("category_profile"), category.createCategory)

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update category (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: Sayur
 *                 description: Nama baru kategori (opsional)
 *               category_profile:
 *                 type: string
 *                 format: binary
 *                 description: Gambar baru kategori (opsional, akan replace gambar lama)
 *     responses:
 *       200:
 *         description: Category berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *             example:
 *               success: true
 *               message: "Category updated"
 *               data:
 *                 id: 1
 *                 categoryName: "Sayur"
 *                 categoryProfile: "https://res.cloudinary.com/example/image.jpg"
 *                 categoryPublicId: "categories/xyz456"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-02T00:00:00.000Z"
 *       400:
 *         description: Nama kategori sudah dipakai category lain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Category already exists"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       403:
 *         description: Forbidden - bukan admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Access denied"
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
router.put("/:id", checkRole("admin"), upload.single("category_profile"), category.updateCategory)

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete category (admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category berhasil dihapus (beserta gambar di Cloudinary jika ada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category deleted"
 *             example:
 *               success: true
 *               message: "Category deleted"
 *       401:
 *         description: Unauthorized - token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No token provided"
 *       403:
 *         description: Forbidden - bukan admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Access denied"
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
router.delete("/:id", checkRole("admin"), category.deleteCategory)

export default router