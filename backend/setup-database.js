/**
 * 데이터베이스 스키마 설정 스크립트
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log('데이터베이스 스키마 생성 시작...');

    // schema.sql 파일 읽기
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 스키마 실행
    await client.query(schemaSql);

    console.log('✓ 스키마 생성 완료');

    // 초기 국경일 데이터 삽입
    console.log('\n초기 국경일 데이터 삽입 중...');

    const holidays = [
      { title: '신정', date: '2025-01-01', description: '새해 첫날', isRecurring: true },
      { title: '설날', date: '2025-01-29', description: '음력 1월 1일', isRecurring: true },
      { title: '삼일절', date: '2025-03-01', description: '3·1 운동 기념일', isRecurring: true },
      { title: '어린이날', date: '2025-05-05', description: '어린이날', isRecurring: true },
      { title: '석가탄신일', date: '2025-05-05', description: '부처님 오신 날', isRecurring: true },
      { title: '현충일', date: '2025-06-06', description: '나라를 위해 목숨을 바친 이들을 기리는 날', isRecurring: true },
      { title: '광복절', date: '2025-08-15', description: '대한민국 독립 기념일', isRecurring: true },
      { title: '추석', date: '2025-10-06', description: '음력 8월 15일', isRecurring: true },
      { title: '개천절', date: '2025-10-03', description: '대한민국 건국 기념일', isRecurring: true },
      { title: '한글날', date: '2025-10-09', description: '한글 창제 기념일', isRecurring: true },
      { title: '크리스마스', date: '2025-12-25', description: '예수 그리스도 탄생 기념일', isRecurring: true }
    ];

    for (const holiday of holidays) {
      try {
        await client.query(
          `INSERT INTO holidays (title, date, description, is_recurring)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [holiday.title, holiday.date, holiday.description, holiday.isRecurring]
        );
        console.log(`  ✓ ${holiday.title} (${holiday.date})`);
      } catch (error) {
        // 이미 존재하는 경우 무시
        if (error.code !== '23505') { // unique constraint violation
          console.log(`  - ${holiday.title} 건너뜀`);
        }
      }
    }

    console.log('\n✓ 초기 데이터 삽입 완료');

    // 테이블 확인
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n생성된 테이블:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // 국경일 데이터 확인
    const holidayCount = await client.query('SELECT COUNT(*) FROM holidays');
    console.log(`\n국경일 데이터: ${holidayCount.rows[0].count}개`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// 실행
setupDatabase()
  .then(() => {
    console.log('\n✓ 데이터베이스 설정 완료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ 설정 실패:', error);
    process.exit(1);
  });
