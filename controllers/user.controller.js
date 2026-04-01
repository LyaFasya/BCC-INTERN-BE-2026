import db from "../models/index.js"
import { Op } from "sequelize"
import { v2 as cloudinary } from "cloudinary"
const userModel = db.user

const getMe = async (request, response) => {
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

const deleteMyAccount = async (request, response) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = request.user.id;

    const profile = await db.userProfile.findOne({ where: { userId }, transaction });
    if (profile && profile.profilePublicId) {
      await cloudinary.uploader.destroy(profile.profilePublicId);
    }

    const userFoods = await db.food.findAll({ where: { userId }, transaction });
    const foodIds = userFoods.map(f => f.id);

    if (foodIds.length > 0) {
      await db.notification.destroy({ where: { foodId: { [Op.in]: foodIds } }, transaction });
      await db.foodLog.destroy({ where: { foodId: { [Op.in]: foodIds } }, transaction });
      await db.food.destroy({ where: { userId }, transaction });
    }

    await db.notification.destroy({ where: { userId }, transaction });
    await db.userProfile.destroy({ where: { userId }, transaction });
    await userModel.destroy({ where: { id: userId }, transaction });
    await transaction.commit();
    response.clearCookie("refreshToken");

    return response.json({
      success: true,
      message: "Your account has been deleted"
    });

  } catch (error) {
    await transaction.rollback();
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export default {getMe, deleteMyAccount}