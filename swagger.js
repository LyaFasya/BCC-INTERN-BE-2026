import swaggerJsdoc from "swagger-jsdoc"
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
        url: process.env.SIMPANIN_URL,
        description: "Production Server"
      },
      {
        url: process.env.SIMPANIN_LOKAL,
        description: "Lokal Server"
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
      },
      schemas: {
        BaseErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string"
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: "Bad Request (e.g., validation fail, missing parameters)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BaseErrorResponse"
              }
            }
          }
        },
        Unauthorized: {
          description: "Unauthorized (e.g., missing or invalid token)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BaseErrorResponse"
              }
            }
          }
        },
        Forbidden: {
          description: "Forbidden (e.g., insufficient permissions or role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BaseErrorResponse"
              }
            }
          }
        },
        NotFound: {
          description: "Not Found (e.g., resource does not exist)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BaseErrorResponse"
              }
            }
          }
        },
        InternalServerError: {
          description: "Internal Server Error (e.g., unexpected backend error)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BaseErrorResponse"
              }
            }
          }
        }
      }
    }
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec