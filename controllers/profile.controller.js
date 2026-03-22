import db from "../models/index.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { fileURLToPath } from "url";

const userProfileModel = db.userProfile;
const userModel = db.user;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_PATH = path.join(__dirname, "../image/profile");

const createProfile = async (request, response) => {
  try {
    const userId = request.user.id
    const existingProfile = await userProfileModel.findOne({
      where: { userId }
    })

    if (existingProfile) {
      return response.status(400).json({
        success: false,
        message: "Profile already exists"
      })
    }

    const { name, phone_number, address, gender } = request.body
    if (!name || !phone_number) {
      return response.status(400).json({
        success: false,
        message: "Name and phone number are required"
      })
    }

    const dataProfile = {
      userId,
      name,
      phoneNumber: phone_number,
      address: address || null,
      gender: gender || null
    }
    if (request.file) {
      dataProfile.profilePicture = request.file.filename
    }

    const newProfile = await userProfileModel.create(dataProfile)
    return response.status(201).json({
      success: true,
      message: "Profile created",
      data: newProfile
    })

  } catch (error) {
    if (request.file) {
      const filePath = path.join(__dirname, "../image/profile", request.file.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
    return response.status(500).json({
      success: false,
      message: error.message
    })

  }
}

const updateProfile = async (request, response) => {
  try {
    const userId = request.user.id
    const profile = await userProfileModel.findOne({
      where: { userId }
    })

    if (!profile) {
      return response.status(404).json({
        success: false,
        message: "Profile not found"
      })
    }

    const updateData = {}
    if (request.body.name) updateData.name = request.body.name
    if (request.body.phone_number) updateData.phoneNumber = request.body.phone_number
    if (request.body.address) updateData.address = request.body.address
    if (request.body.gender) updateData.gender = request.body.gender
    if (request.file) {
      if (profile.profilePicture) {
        const oldPath = path.join(IMAGE_PATH, profile.profilePicture)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      updateData.profilePicture = request.file.filename
    }

    await userProfileModel.update(updateData, {
      where: { userId }
    })
    const updatedProfile = await userProfileModel.findOne({
      where: { userId }
    })

    return response.json({
      success: true,
      message: "Profile updated",
      data: updatedProfile
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

const getAllProfile = async (request, response) => {
  try {
    const profiles = await userProfileModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ["id", "email"]
        }
      ]
    })

    return response.json({
      success: true,
      message: "All profiles retrieved",
      data: profiles
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getMyProfile = async (request, response) => {
  try {
    const profile = await userProfileModel.findOne({
      where: { userId: request.user.id }
    })

    if (!profile) {
      return response.status(404).json({
        success: false,
        message: "Profile not found"
      })
    }
    return response.json({
      success: true,
      data: profile
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getProfileByKeyword = async (request, response) => {
  try {
    const keyword = Object.keys(request.query)[0] || ""
    const profiles = await userProfileModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phoneNumber: { [Op.like]: `%${keyword}%` } },
          { address: { [Op.like]: `%${keyword}%` } }
        ]
      }
    })

    return response.json({
      success: true,
      message: "Search profiles success",
      data: profiles
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default {createProfile, updateProfile, getAllProfile, getMyProfile, getProfileByKeyword,};