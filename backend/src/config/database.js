const { Pool } = require('pg');

// Connection Pool 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                    // 최대 연결 수
  idleTimeoutMillis: 30000,   // 유휴 연결 타임아웃 (30초)
  connectionTimeoutMillis: 2000, // 연결 타임아웃 (2초)
});

// Connection Pool 이벤트 핸들러
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

// 데이터베이스 연결 테스트 함수
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`   Server time: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 연결 풀 종료 함수 (graceful shutdown)
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  closePool,
};
