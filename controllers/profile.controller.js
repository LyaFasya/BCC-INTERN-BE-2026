import db from "../models/index.js"
import { Op } from "sequelize"
import { uploadImage } from "../services/cloudinary.service.js"
import { v2 as cloudinary } from "cloudinary"

const userProfileModel = db.userProfile
const userModel = db.user

const createProfile = async (request, response) => {
  try {
    const userId = request.user.id
    const existingProfile = await userProfileModel.findOne({
      where: { userId },
    })
    if (existingProfile) {
      return response.status(400).json({
        success: false,
        message: "Profile already exists",
      })
    }

    const { name, phone_number, address, gender } = request.body
    if (!name || !phone_number) {
      return response.status(400).json({
        success: false,
        message: "Name and phone number are required",
      })
    }
    if (!/^[0-9]+$/.test(phone_number)) {
      return response.status(400).json({
        success: false,
        message: "Phone number must be numeric",
      })
    } 

    const dataProfile = {
      userId,
      name: name.trim(),
      phoneNumber: phone_number.trim(),
      address: address || null,
      gender: gender || null,
    }

    if (request.file) {
      try {
        const result = await uploadImage(request.file, "profiles")
        dataProfile.profilePicture = result.url
        dataProfile.profilePublicId = result.public_id
      } catch (err) {
        return response.status(500).json({
          success: false,
          message: "Image upload failed",
        })
      }
    }

    const newProfile = await userProfileModel.create(dataProfile)
    return response.status(201).json({
      success: true,
      message: "Profile created",
      data: newProfile,
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProfile = async (request, response) => {
  try {
    const userId = request.user.id
    const profile = await userProfileModel.findOne({
      where: { userId },
    })
    if (!profile) {
      return response.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }

    const updateData = {}
    if (request.body.name) { updateData.name = request.body.name.trim()}
    if (request.body.phone_number) {
      if (!/^[0-9]+$/.test(request.body.phone_number)) {
        return response.status(400).json({
          success: false,
          message: "Phone number must be numeric",
        })
      }
      updateData.phoneNumber = request.body.phone_number.trim()
    }
    if (request.body.address) {updateData.address = request.body.address}
    if (request.body.gender) {updateData.gender = request.body.gender}
    
    if (request.file) {
      if (profile.profilePublicId) {
        await cloudinary.uploader.destroy(profile.profilePublicId)
      }
      const result = await uploadImage(request.file, "profiles")
      updateData.profilePicture = result.url
      updateData.profilePublicId = result.public_id
    }
    await profile.update(updateData)
    const updatedProfile = await userProfileModel.findOne({
      where: { userId },
    })
    return response.json({
      success: true,
      message: "Profile updated",
      data: updatedProfile,
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
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
    const keyword = request.query.search || ""
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

export default {createProfile, updateProfile, getAllProfile, getMyProfile, getProfileByKeyword,}