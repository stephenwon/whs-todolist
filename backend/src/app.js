const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger/swagger.json");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const trashRoutes = require("./routes/trashRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const { generalRateLimit } = require("./middlewares/rateLimitMiddleware");

const app = express();

// 미들웨어 설정!!!
app.use(generalRateLimit); // 요청 제한 미들웨어
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 헬스체크 엔드포인트
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Swagger UI 엔드포인트
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "WHS-TodoList API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// 라우트 등록
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/users", userRoutes);

// 404 처리
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다",
    },
  });
});

// 에러 핸들러 (가장 마지막에 등록)
app.use(errorHandler);

module.exports = app;
