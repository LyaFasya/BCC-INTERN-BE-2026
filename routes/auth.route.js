import express from "express"
const router = express.Router()

import { verifyToken } from "../middlewares/verifyToken.js"
import authController from "../controllers/auth.controller.js"

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Register Success, please check your email for verification"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@mail.com"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login success"
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@mail.com"
 *             role:
 *               type: string
 *               example: "user"
 *     CheckAuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User is logged in"
 *         data:
 *           type: object
 *           description: Full user object (excluding password)
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, confirm_password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 example: User123456
 *                 description: Minimal 6 karakter dan mengandung minimal 1 huruf kapital
 *               confirm_password:
 *                 type: string
 *                 example: User123456
 *     responses:
 *       201:
 *         description: Register berhasil, email verifikasi dikirim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *             example:
 *               success: true
 *               message: "Register Success, please check your email for verification"
 *               data:
 *                 id: 1
 *                 email: "user@mail.com"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               passwordMismatch:
 *                 summary: Password tidak cocok
 *                 value:
 *                   success: false
 *                   message: "Password and confirm password do not match"
 *               passwordWeak:
 *                 summary: Password tidak memenuhi syarat
 *                 value:
 *                   success: false
 *                   message: "Password must be at least 6 characters and contain at least 1 uppercase letter"
 *               emailTaken:
 *                 summary: Email sudah terdaftar
 *                 value:
 *                   success: false
 *                   message: "Email already registered"
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
router.post("/register", authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 example: User123456
 *     responses:
 *       200:
 *         description: Login berhasil, cookie token dan refreshToken di-set
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               message: "Login success"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               data:
 *                 id: 1
 *                 email: "user@mail.com"
 *                 role: "user"
 *         headers:
 *           Set-Cookie:
 *             description: Mengatur cookie HTTPOnly untuk token (15m) dan refreshToken (7d)
 *             schema:
 *               type: string
 *       401:
 *         description: Password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid password"
 *       403:
 *         description: Akun belum diverifikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Akun belum diverifikasi, silakan cek email kamu"
 *       404:
 *         description: Email tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "Email not found"
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
router.post("/login", authController.login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user yang sedang login (tanpa field password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckAuthResponse'
 *             example:
 *               success: true
 *               message: "User is logged in"
 *               data:
 *                 id: 1
 *                 email: "user@mail.com"
 *                 role: "user"
 *                 is_verified: true
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
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "User not found"
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
router.get("/me", verifyToken, authController.checkAuth)

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Hapus akun user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus beserta semua data terkait
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
 *                   example: "Your account has been deleted"
 *             example:
 *               success: true
 *               message: "Your account has been deleted"
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
router.delete("/me", verifyToken, authController.deleteMyAccount)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token menggunakan refreshToken cookie
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: RefreshToken dari HttpOnly Cookie di browser
 *     responses:
 *       200:
 *         description: Access token baru berhasil digenerate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *             example:
 *               success: true
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Tidak ada refresh token di cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "No refresh token"
 *       403:
 *         description: Token tidak valid, tidak cocok, atau sudah expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: Token tidak cocok di database
 *                 value:
 *                   success: false
 *                   message: "Invalid token"
 *               expiredToken:
 *                 summary: Token sudah expired
 *                 value:
 *                   success: false
 *                   message: "Token expired or invalid"
 */
router.post("/refresh", authController.refreshToken)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user dan hapus refreshToken cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
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
 *                   example: "Logout success"
 *             example:
 *               success: true
 *               message: "Logout success"
 *       204:
 *         description: Tidak ada refreshToken cookie (sudah logout atau belum login) - no body
 */
router.post("/logout", authController.logout)

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Update password user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword, confirmPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: User123456
 *               newPassword:
 *                 type: string
 *                 example: User654321
 *                 description: Minimal 6 karakter
 *               confirmPassword:
 *                 type: string
 *                 example: User654321
 *     responses:
 *       200:
 *         description: Password berhasil diupdate
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
 *                   example: "Password updated successfully"
 *             example:
 *               success: true
 *               message: "Password updated successfully"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Ada field yang kosong
 *                 value:
 *                   success: false
 *                   message: "All fields are required"
 *               confirmMismatch:
 *                 summary: Konfirmasi password tidak cocok
 *                 value:
 *                   success: false
 *                   message: "Password confirmation does not match"
 *               passwordTooShort:
 *                 summary: Password baru terlalu pendek
 *                 value:
 *                   success: false
 *                   message: "Password must be at least 6 characters"
 *               wrongOldPassword:
 *                 summary: Password lama salah
 *                 value:
 *                   success: false
 *                   message: "Wrong old password"
 *               samePassword:
 *                 summary: Password baru sama dengan yang lama
 *                 value:
 *                   success: false
 *                   message: "New password must be different"
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
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             example:
 *               success: false
 *               message: "User not found"
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
router.put("/update-password", verifyToken, authController.updatePassword)

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify user email using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to email
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/verify/:token', authController.verifyEmail)

export default router