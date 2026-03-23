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
 * /profile:
 *   get:
 *     summary: Get all profiles (admin only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All profiles retrieved
 *       403:
 *         description: Forbidden
 */
router.get("/", auth, checkRole("admin"), userProfileController.getAllProfile);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create profile
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
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created
 */
router.post("/", auth, upload.single("profile_picture"), userProfileController.createProfile);

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       404:
 *         description: Profile not found
 */
router.get("/me", auth, userProfileController.getMyProfile);

/**
 * @swagger
 * /profile/search:
 *   get:
 *     summary: Search profiles
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword for search
 *     responses:
 *       200:
 *         description: Search success
 */
router.get("/search", auth, userProfileController.getProfileByKeyword);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update profile
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
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/", auth, upload.single("profile_picture"), userProfileController.updateProfile);

export default router;