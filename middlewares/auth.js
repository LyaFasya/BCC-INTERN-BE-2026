import jwt from "jsonwebtoken"

const access_secret = process.env.JWT_SECRET || "simpanin"
const auth = (request, response, next) => {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      })
    }

    const parts = authHeader.split(" ")
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token format",
      })
    }

    const token = parts[1]
    const decoded = jwt.verify(token, access_secret)
    request.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({
        success: false,
        message: "Token expired",
      })
    }
    return response.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}

export default auth