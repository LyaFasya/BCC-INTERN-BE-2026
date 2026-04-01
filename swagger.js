import swaggerJsdoc from "swagger-jsdoc"

// 🚨 Menyembunyikan DeprecationWarning tentang `url.parse` yang berasal dari dependensi usang bawaan swagger-jsdoc (@apidevtools)
const originalEmit = process.emit;
process.emit = function (name, data, ...args) {
  if (name === "warning" && typeof data === "object" && data.name === "DeprecationWarning" && data.message.includes("url.parse")) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};

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