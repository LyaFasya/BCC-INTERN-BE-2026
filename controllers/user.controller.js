const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op

exports.getAllUser = async (request, response) => {
  try {
    const currentUserId = request.user.id
    const users = await userModel.findAll({
      attributes: ["id", "email", "role"], 
      where: {
        [Op.or]: [
          { role: "user" },
          { id: currentUserId } 
        ]
      }
    })

    return response.json({
      success: true,
      data: users,
      message: "All users have been loaded"
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getMe = async (request, response) => {
  try {
    const user = await userModel.findByPk(request.user.id, {
      attributes: ["email"]
    })

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    return response.json({
      success: true,
      data: user
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.deleteMyAccount = async (request, response) => {
  try {
    await userModel.destroy({
      where: { id: request.user.id }
    })

    return response.json({
      success: true,
      message: "Your account has been deleted"
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}
