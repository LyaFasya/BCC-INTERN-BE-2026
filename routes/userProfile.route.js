import express from "express"

const router = express.Router()

import userProfileController from "../controllers/profile.controller.js"
import auth from "../middlewares/auth.js"
import checkRole from "../middlewares/checkRole.js"
import upload from "../middlewares/upload.js"

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Rizky"
 *         phoneNumber:
 *           type: string
 *           example: "08123456789"
 *         address:
 *           type: string
 *           nullable: true
 *           example: "Jl. Merdeka No. 1, Jakarta"
 *         gender:
 *           type: string
 *           nullable: true
 *           example: "male"
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL gambar profil dari Cloudinary
 *           example: "https://res.cloudinary.com/example/profiles/abc123.jpg"
 *         profilePublicId:
 *           type: string
 *           nullable: true
 *           description: Public ID Cloudinary untuk keperluan update/delete gambar
 *           example: "profiles/abc123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProfileWithUser:
 *       allOf:
 *         - $ref: '#/components/schemas/Profile'
 *         - type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "user@mail.com"
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Profile'
 *     ProfileListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProfileWithUser'
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get all profiles (admin only) - include data email user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semua profil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileListResponse'
 *             example:
 *               success: true
 *               message: "All profiles retrieved"
 *               data:
 *                 - id: 1
 *                   userId: 1
 *                   name: "Rizky"
 *                   phoneNumber: "08123456789"
 *                   address: "Jl. Merdeka No. 1"
 *                   gender: "male"
 *                   profilePicture: "https://res.cloudinary.com/example/image.jpg"
 *                   profilePublicId: "profiles/abc123"
 *                   user:
 *                     id: 1
 *                     email: "user@mail.com"
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
 *             example:
 *               success: false
 *               message: "Internal server error"
 */
router.get("/", auth, checkRole("admin"), userProfileController.getAllProfile)

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create profile (hanya bisa dibuat 1x per user)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rizky
 *               phone_number:
 *                 type: string
 *                 example: 08123456789
 *                 description: Harus berupa angka
 *               address:
 *                 type: string
 *                 example: Jl. Merdeka No. 1
 *                 description: Opsional
 *               gender:
 *                 type: string
 *                 example: male
 *                 description: Opsional
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Opsional
 *     responses:
 *       201:
 *         description: Profile berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             example:
 *               success: true
 *               message: "Profile created"
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 name: "Rizky"
 *                 phoneNumber: "08123456789"
 *                 address: "Jl. Merdeka No. 1"
 *                 gender: "male"
 *                 profilePicture: "https://res.cloudinary.com/example/image.jpg"
 *                 profilePublicId: "profiles/abc123"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               profileExists:
 *                 summary: Profile sudah ada untuk user ini
 *                 value:
 *                   success: false
 *                   message: "Profile already exists"
 *               missingFields:
 *                 summary: Name atau phone_number kosong
 *                 value:
 *                   success: false
 *                   message: "Name and phone number are required"
 *               notNumeric:
 *                 summary: Phone number bukan angka
 *                 value:
 *                   success: false
 *                   message: "Phone number must be numeric"
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
router.post("/", auth, upload.single("profile_picture"), userProfileController.createProfile)

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get profil user yang sedang login
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil (tidak ada field message di response)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 name: "Rizky"
 *                 phoneNumber: "08123456789"
 *                 address: "Jl. Merdeka No. 1"
 *                 gender: "male"
 *                 profilePicture: "https://res.cloudinary.com/example/image.jpg"
 *                 profilePublicId: "profiles/abc123"
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
 *         description: Profile tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Profile not found"
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
router.get("/me", auth, userProfileController.getMyProfile)

/**
 * @swagger
 * /profile/search:
 *   get:
 *     summary: Search profiles by keyword (admin only) - search by name, phoneNumber, or address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Keyword untuk pencarian (name / phoneNumber / address). Jika kosong, return semua profil.
 *         example: Rizky
 *     responses:
 *       200:
 *         description: Hasil pencarian profil (bisa array kosong jika tidak ada yang cocok)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileListResponse'
 *             example:
 *               success: true
 *               message: "Search profiles success"
 *               data:
 *                 - id: 1
 *                   userId: 1
 *                   name: "Rizky"
 *                   phoneNumber: "08123456789"
 *                   address: "Jl. Merdeka No. 1"
 *                   gender: "male"
 *                   profilePicture: "https://res.cloudinary.com/example/image.jpg"
 *                   profilePublicId: "profiles/abc123"
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
router.get("/search", auth, userProfileController.getProfileByKeyword)

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update profile user yang sedang login (semua field opsional)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rizky Updated
 *                 description: Opsional
 *               phone_number:
 *                 type: string
 *                 example: 08198765432
 *                 description: Opsional. Harus berupa angka.
 *               address:
 *                 type: string
 *                 example: Jl. Baru No. 99
 *                 description: Opsional
 *               gender:
 *                 type: string
 *                 example: female
 *                 description: Opsional
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Opsional. Foto baru akan replace foto lama di Cloudinary.
 *     responses:
 *       200:
 *         description: Profile berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             example:
 *               success: true
 *               message: "Profile updated"
 *               data:
 *                 id: 1
 *                 userId: 1
 *                 name: "Rizky Updated"
 *                 phoneNumber: "08198765432"
 *                 address: "Jl. Baru No. 99"
 *                 gender: "female"
 *                 profilePicture: "https://res.cloudinary.com/example/image_new.jpg"
 *                 profilePublicId: "profiles/xyz456"
 *       400:
 *         description: Phone number bukan angka
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Phone number must be numeric"
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
 *         description: Profile tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Profile not found"
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
router.put("/", auth, upload.single("profile_picture"), userProfileController.updateProfile)

export default router