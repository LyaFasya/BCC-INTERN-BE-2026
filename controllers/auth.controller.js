import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from 'crypto'
import sendEmail from '../services/email.service.js'
import db from "../models/index.js"
const userModel = db.user
const access_secret = process.env.JWT_SECRET || "simpanin"
const refresh_secret = process.env.JWT_REFRESH_SECRET || "simpanin_refresh"
const SIMPANIN_URL = process.env.SIMPANIN_URL

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
    const token = crypto.randomBytes(32).toString('hex')
    const user = await userModel.create({
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: token
    })

    const link = `${SIMPANIN_URL}/auth/verify/${token}`
    await sendEmail(
      user.email,
      'Verifikasi Email Kamu',
      `
        <h2>Halo 👋</h2>
        <p>Terima kasih sudah register</p>
        <p>Klik link ini untuk verifikasi akun kamu:</p>
        <a href="${link}">${link}</a>
      `
    )

    return response.status(201).json({
      success: true,
      message: "Register Success, please check your email for verification",
      data: {
        id: user.id,
        email: user.email
      }
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
    const dataUser = await userModel.findOne({ where: { email } })
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

    if (!dataUser.is_verified) {
      return response.status(403).json({
        success: false,
        message: "Akun belum diverifikasi, silakan cek email kamu"
      });
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

    const isProduction = process.env.NODE_ENV === "production"
    response.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    })

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return response.status(200).json({
      success: true,
      message: "Login success",
      accessToken,
      data: {
        id: dataUser.id,
        email: dataUser.email,
        role: dataUser.role
      }
    })

  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const checkAuth = async (request, response) => {
  try {
    const user = await userModel.findByPk(request.user.id, {
      attributes: { exclude: ["password"] },
    })
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
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    })
  }
}

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

const verifyEmail = async (request, response) => {
  try {
    const { token } = request.params;
    const user = await userModel.findOne({
      where: { verification_token: token }
    });

    if (!user) {
      return response.status(400).send(`
        <html>
          <body style="text-align:center;font-family:sans-serif;margin-top:50px;">
            <h2>❌ Token tidak valid</h2>
            <p>Link verifikasi tidak ditemukan atau sudah digunakan.</p>
          </body>
        </html>
      `);
    }

    await user.update({
      is_verified: true,
      verification_token: null
    });

    return response.send(`
      <html>
        <head>
          <title>Verifikasi Berhasil</title>
        </head>
        <body style="text-align:center;font-family:sans-serif;margin-top:50px;">
          <h2>✅ Email berhasil diverifikasi</h2>
        </body>
      </html>
    `);

  } catch (error) {
    return response.status(500).send(`
      <html>
        <body style="text-align:center;font-family:sans-serif;margin-top:50px;">
          <h2>⚠️ Terjadi kesalahan</h2>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
}

export default {register, login, refreshToken, logout, updatePassword, checkAuth, verifyEmail}
