import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
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
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Register Success
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: |
 *       Login user dan akan:
 *       - Mengembalikan accessToken
 *       - Menyimpan refreshToken di cookie (httpOnly)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token stored in cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid password
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post("/login", authController.login);

router.get("/me", auth, authController.checkAuth);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Get new access token
 *     tags: [Auth]
 *     description: Menggunakan refresh token dari cookie
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: No token
 *       403:
 *         description: Invalid token
 */
router.post("/refresh", authController.refreshToken);

router.get("/me", auth, authController.checkAuth);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Menghapus refresh token dari cookie dan database
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post("/logout", authController.logout);

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
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 1234567
 *               confirmPassword:
 *                 type: string
 *                 example: 1234567
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/update-password", auth, authController.updatePassword);

export default router;