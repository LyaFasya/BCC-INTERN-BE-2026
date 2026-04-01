import jwt from "jsonwebtoken"

const access_secret = process.env.JWT_SECRET || "simpanin"
const auth = (request, response, next) => {
  try {
    const token = request.cookies.token || (request.headers.authorization && request.headers.authorization.split(" ")[1])
    
    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      })
    }

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