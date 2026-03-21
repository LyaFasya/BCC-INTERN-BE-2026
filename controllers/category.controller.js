const foodCategoryModel = require("../models").foodCategory
const fs = require("fs")
const path = require("path")
const IMAGE_PATH = path.join(__dirname, "../image/category")

exports.createCategory = async (request, result) => {
  try {
    const { category_name, description } = request.body
    if (!category_name) {
      return result.status(400).json({
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
    return result.status(201).json({
      success: true,
      message: "Category created",
      data: newCategory
    })

  } catch (error) {
    if (request.file) {
      const filePath = path.join(IMAGE_PATH, request.file.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    return result.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getAllCategory = async (request, response) => {
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

exports.updateCategory = async (request, result) => {
  try {
    const category = await foodCategoryModel.findByPk(request.params.id)
    if (!category) {
      return result.status(404).json({
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
    return result.json({
      success: true,
      message: "Category updated",
      data: updated
    })

  } catch (error) {
    if (request.file) {
      const filePath = path.join(IMAGE_PATH, request.file.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    return result.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.deleteCategory = async (request, result) => {
  try {
    const category = await foodCategoryModel.findByPk(request.params.id)
    if (!category) {
      return result.status(404).json({
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

    return result.json({
      success: true,
      message: "Category deleted"
    })

  } catch (error) {
    return result.status(500).json({
      success: false,
      message: error.message
    })
  }
}