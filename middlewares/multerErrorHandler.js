import multer from "multer"

export const multerErrorHandler = (error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({
      success: false,
      message: error.message,
    })
  }

  if (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    })
  }

  next()
}