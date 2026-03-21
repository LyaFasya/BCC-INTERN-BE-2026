const express = require("express");
const router = express.Router();
const category = require("../controllers/category.controller");
const authenticate = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/uploadCategory");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Food Category API
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
 *         description: List of categories
 */
router.get("/", category.getAllCategory);

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
 *               description:
 *                 type: string
 *               category_profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Forbidden
 */
router.post("/", checkRole("admin"), upload.single("category_profile"), category.createCategory);

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
 *               description:
 *                 type: string
 *               category_profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put("/:id", checkRole("admin"), upload.single("category_profile"), category.updateCategory);

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
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", checkRole("admin"), category.deleteCategory);

module.exports = router;