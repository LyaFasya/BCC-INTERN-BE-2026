import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "../models/index.js"
const userModel = db.user
const access_secret = process.env.JWT_SECRET || "simpanin"
const refresh_secret = process.env.JWT_REFRESH_SECRET || "simpanin_refresh"

const register = async (request, response) => {
  try {

    const { email, password, confirm_password } = request.body
    if (password !== confirm_password) {
      return response.status(400).json({
        success: false,
        message: "Password and confirm password do not match"
      })
    }
    if (!password || password.length < 6 || !/[A-Z]/.test(password)) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 6 characters and contain at least 1 uppercase letter"
      })
    }

    const existingUser = await userModel.findOne({
      where: { email }
    })
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Email already registered"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
      email,
      password: hashedPassword
    })
    const { password: _, ...userWithoutPassword } = user.toJSON()
    return response.status(201).json({
      success: true,
      message: "Register Success",
      data: userWithoutPassword
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const login = async (request, response) => {
  try {
    const { email, password } = request.body
    const dataUser = await userModel.findOne({
      where: { email }
    })
    if (!dataUser) {
      return response.status(404).json({
        success: false,
        message: "Email not found"
      })
    }

    const validPassword = await bcrypt.compare(password, dataUser.password)
    if (!validPassword) {
      return response.status(401).json({
        success: false,
        message: "Invalid password"
      })
    }

    const payload = {
      id: dataUser.id,
      email: dataUser.email,
      role: dataUser.role
    }
    const accessToken = jwt.sign(payload, access_secret, {
      expiresIn: "15m"
    })
    const refreshToken = jwt.sign(payload, refresh_secret, {
      expiresIn: "7d"
    })

    await dataUser.update({ refreshToken })
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const { password: _, refreshToken: __, ...userApprove } =
      dataUser.toJSON()
    return response.status(200).json({
      success: true,
      message: "Login success",
      data: userApprove,
      accessToken
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const checkAuth = async (request, response) => {
  try {
    const user = await userModel.findByPk(request.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    return response.status(200).json({
      success: true,
      message: "User is logged in",
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const refreshToken = async (request, response) => {
  try {
    const token = request.cookies.refreshToken
    if (!token) {
      return response.status(401).json({
        success: false,
        message: "No refresh token"
      })
    }

    const decoded = jwt.verify(token, refresh_secret)
    const user = await userModel.findByPk(decoded.id)
    if (!user || user.refreshToken !== token) {
      return response.status(403).json({
        success: false,
        message: "Invalid token"
      })
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }
    const newAccessToken = jwt.sign(payload, access_secret, {
      expiresIn: "15m"
    })

    return response.json({
      success: true,
      accessToken: newAccessToken
    })

  } catch (error) {
    return response.status(403).json({
      success: false,
      message: "Token expired or invalid"
    })
  }
}

const logout = async (request, response) => {
  try {
    const token = request.cookies.refreshToken
    if (!token) return response.sendStatus(204)
    const decoded = jwt.verify(token, refresh_secret)

    await userModel.update(
      { refreshToken: null },
      { where: { id: decoded.id } }
    )
    
    response.clearCookie("refreshToken")
    return response.json({
      success: true,
      message: "Logout success"
    })

  } catch (error) {
    response.clearCookie("refreshToken")
    return response.sendStatus(204)
  }
}

const updatePassword = async (request, response) => {
  try {
    const userId = request.user.id
    const { oldPassword, newPassword, confirmPassword } = request.body
    if (!oldPassword || !newPassword || !confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        success: false,
        message: "Password confirmation does not match"
      })
    }

    if (newPassword.length < 6) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      })
    }

    const user = await userModel.findByPk(userId)
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return response.status(400).json({
        success: false,
        message: "Wrong old password"
      })
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return response.status(400).json({
        success: false,
        message: "New password must be different"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await userModel.update(
      { password: hashedPassword },
      { where: { id: userId } }
    )

    return response.json({
      success: true,
      message: "Password updated successfully"
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default {register, login, refreshToken, logout, updatePassword, checkAuth}
