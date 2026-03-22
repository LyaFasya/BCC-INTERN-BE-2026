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
        url: "http://localhost:8000"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec