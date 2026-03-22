import db from "../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const foodCategoryModel = db.foodCategory;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_PATH = path.join(__dirname, "../image/category");

const createCategory = async (request, response) => {
  try {
    const { category_name, description } = request.body
    if (!category_name) {
      return response.status(400).json({
        success: false,
        message: "Category name is required"
      })
    }

    const data = {
      categoryName: category_name,
      description: description || null
    }
    if (request.file) {
      data.categoryProfile = request.file.filename
    }

    const newCategory = await foodCategoryModel.create(data)
    return response.status(201).json({
      success: true,
      message: "Category created",
      data: newCategory
    })

  } catch (error) {
    if (request.file) {
      const filePath = path.join(IMAGE_PATH, request.file.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getAllCategory = async (request, response) => {
  try {
    const data = await foodCategoryModel.findAll()
    return response.json({
      success: true,
      data
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateCategory = async (request, response) => {
  try {
    const category = await foodCategoryModel.findByPk(request.params.id)
    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    const updateData = {}
    if (request.body.category_name) {
      updateData.categoryName = request.body.category_name
    }
    if (request.body.description) {
      updateData.description = request.body.description
    }
    if (request.file) {
      if (category.categoryProfile) {
        const oldPath = path.join(IMAGE_PATH, category.categoryProfile)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      updateData.categoryProfile = request.file.filename
    }

    await foodCategoryModel.update(updateData, {
      where: { id: request.params.id }
    })

    const updated = await foodCategoryModel.findByPk(request.params.id)
    return response.json({
      success: true,
      message: "Category updated",
      data: updated
    })

  } catch (error) {
    if (request.file) {
      const filePath = path.join(IMAGE_PATH, request.file.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteCategory = async (request, response) => {
  try {
    const category = await foodCategoryModel.findByPk(request.params.id)
    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    
    if (category.categoryProfile) {
      const filePath = path.join(IMAGE_PATH, category.categoryProfile)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    await foodCategoryModel.destroy({
      where: { id: request.params.id }
    })

    return response.json({
      success: true,
      message: "Category deleted"
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default {createCategory, getAllCategory, updateCategory, deleteCategory,};