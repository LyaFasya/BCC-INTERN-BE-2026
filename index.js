import 'dotenv/config';
import express from "express";

import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/userProfile.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/foodCategory.route.js";
import foodRoutes from "./routes/food.route.js"

import createAdmin from "./utils/createAdmin.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("image"));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use("/food", foodRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

createAdmin();

app.listen(PORT, () => {
  console.log(`Server of Simpanin.id runs on port ${PORT}`);
});

export default app;