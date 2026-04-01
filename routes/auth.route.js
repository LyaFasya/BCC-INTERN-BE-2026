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
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         accessToken:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
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
 *                 description: Minimal 6 karakter, format terdapat minimal 1 huruf besar
 *               confirm_password:
 *                 type: string
 *                 example: User123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
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
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Mengatur cookie HTTPOnly untuk token dan refreshToken
 *             schema:
 *               type: string
 */
router.post("/login", authController.login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.get("/me", verifyToken, authController.checkAuth)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Nilai RefreshToken dari HttpOnly Cookie di browser
 *     responses:
 *       200:
 *         description: New token generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 */
router.post("/refresh", authController.refreshToken)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post("/logout", authController.logout)

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Update user password
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
 *         description: Password updated successfully
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