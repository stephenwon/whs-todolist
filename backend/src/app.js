const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 라우트 등록 (추후 추가)
// app.use('/api/auth', authRoutes);
// app.use('/api/todos', todoRoutes);
// app.use('/api/trash', trashRoutes);
// app.use('/api/holidays', holidayRoutes);
// app.use('/api/users', userRoutes);

// 에러 핸들러 (추후 추가)
// app.use(errorMiddleware);

module.exports = app;
