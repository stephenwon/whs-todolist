require('dotenv').config();
const app = require('./app');
const { testConnection, closePool } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ Failed to connect to database. Server startup aborted.');
      process.exit(1);
    }

    // 서버 시작
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📴 SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('📴 SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
