const checkRole = (...allowedRoles) => {
  return (request, response, next) => {
    try {
      const user = request.user
      if (!user || !user.role) {
        return response.status(403).json({
          success: false,
          message: "Access denied: No role found",
        })
      }
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return response.status(403).json({
          success: false,
          message: "Access denied: Forbidden",
        })
      }
      next()
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

export default checkRole