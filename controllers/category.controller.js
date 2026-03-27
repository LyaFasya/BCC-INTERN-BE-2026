import db from "../models/index.js"
import { Sequelize } from "sequelize"
import { uploadImage } from "../services/cloudinary.service.js"
import { v2 as cloudinary } from "cloudinary"
const foodCategoryModel = db.foodCategory

const createCategory = async (request, response) => {
  try {
    const {category_name} = request.body
    if (!category_name) {
      return response.status(400).json({
        success: false,
        message: "Category name is required",
      })
    }
    const cleanName = category_name.trim()
    const data = {
      categoryName: cleanName
    }
    if (request.file) {
      try {
        const result = await uploadImage(request.file, "categories")
        data.categoryProfile = result.url
        data.categoryPublicId = result.public_id
      } catch (err) {
        return response.status(500).json({
          success: false,
          message: "Image upload failed",
        })
      }
    }
    const existingCategory = await foodCategoryModel.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("category_name")),
        cleanName.toLowerCase()
      )
    })
    if (existingCategory) {
      return response.status(400).json({
        success: false,
        message: "Category already exists",
      })
    }
    const newCategory = await foodCategoryModel.create(data)
    return response.status(201).json({
      success: true,
      message: "Category created",
      data: newCategory,
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
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
        message: "Category not found",
      })
    }

    const updateData = {}
    if (request.body.category_name) {
      const cleanName = request.body.category_name.trim()
      const existingCategory = await foodCategoryModel.findOne({
        where: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("categoryName")),
          cleanName.toLowerCase()
        )
      })
      if (existingCategory && existingCategory.id !== category.id) {
        return response.status(400).json({
          success: false,
          message: "Category already exists",
        })
      }
      updateData.categoryName = cleanName
    }

    if (request.file) {
      if (category.categoryPublicId) {
        await cloudinary.uploader.destroy(category.categoryPublicId)
      }
      const result = await uploadImage(request.file, "categories")
      updateData.categoryProfile = result.url
      updateData.categoryPublicId = result.public_id
    }
    await category.update(updateData)

    const updated = await foodCategoryModel.findByPk(request.params.id)
    return response.json({
      success: true,
      message: "Category updated",
      data: updated,
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteCategory = async (request, response) => {
  try {
    const category = await foodCategoryModel.findByPk(request.params.id)
    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Category not found",
      })
    }
    if (category.categoryPublicId) {
      await cloudinary.uploader.destroy(category.categoryPublicId)
    }
    await foodCategoryModel.destroy({
      where: { id: request.params.id },
    })
    return response.json({
      success: true,
      message: "Category deleted",
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default {createCategory, getAllCategory, updateCategory, deleteCategory}