import jwt from 'jsonwebtoken'

const access_secret = process.env.JWT_SECRET || "simpanin"

export const verifyToken = (request, result, next) => {
  try {
    const token =
      request.cookies.token ||
      request.headers.authorization?.split(' ')[1]

    if (!token) {
      return result.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, access_secret)
    request.user = decoded
    next()
  } catch (error) {
    return result.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}