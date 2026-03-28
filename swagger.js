import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Simpanin",
      version: "1.0.0",
      description: "API documentation"
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local Development Server"
      },
      {
        url: "https://api-node-simpaninid.up.railway.app",
        description: "Production Server"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan **AccessToken** untuk autorisasi Endpoint terlindungi."
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Token pasif yang ada di browser Cookie (HTTP-only) untuk route Refresh."
        }
      }
    }
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec