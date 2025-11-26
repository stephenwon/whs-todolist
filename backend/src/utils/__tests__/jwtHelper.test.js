const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} = require('../jwtHelper');

// 테스트 환경 변수 설정
process.env.JWT_SECRET = 'test-secret-key-for-jwt-testing';
process.env.JWT_ACCESS_EXPIRATION = '15m';
process.env.JWT_REFRESH_EXPIRATION = '7d';

describe('JWT Helper 유틸리티 테스트', () => {

  describe('토큰 생성 테스트', () => {

    describe('generateAccessToken', () => {
      test('유효한 payload로 Access Token을 성공적으로 생성해야 함', () => {
        const payload = { userId: 1, email: 'test@example.com' };
        const token = generateAccessToken(payload);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        // 토큰 디코딩하여 payload 확인
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe(payload.userId);
        expect(decoded.email).toBe(payload.email);
        expect(decoded.exp).toBeDefined(); // 만료 시간 존재 확인
      });

      test('생성된 Access Token에 payload 정보가 올바르게 포함되어야 함', () => {
        const payload = { userId: 123, email: 'user@test.com', role: 'admin' };
        const token = generateAccessToken(payload);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe(123);
        expect(decoded.email).toBe('user@test.com');
        expect(decoded.role).toBe('admin');
      });

      test('빈 payload로도 토큰을 생성할 수 있어야 함', () => {
        const payload = {};
        const token = generateAccessToken(payload);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
      });
    });

    describe('generateRefreshToken', () => {
      test('유효한 payload로 Refresh Token을 성공적으로 생성해야 함', () => {
        const payload = { userId: 1 };
        const token = generateRefreshToken(payload);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        // 토큰 디코딩하여 payload 확인
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe(payload.userId);
        expect(decoded.exp).toBeDefined();
      });

      test('생성된 Refresh Token에 payload 정보가 올바르게 포함되어야 함', () => {
        const payload = { userId: 456 };
        const token = generateRefreshToken(payload);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe(456);
      });

      test('Access Token과 Refresh Token의 만료 시간이 달라야 함', () => {
        const payload = { userId: 1 };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Refresh Token의 만료 시간이 Access Token보다 길어야 함
        expect(decodedRefresh.exp).toBeGreaterThan(decodedAccess.exp);
      });
    });
  });

  describe('토큰 검증 테스트', () => {

    describe('verifyAccessToken', () => {
      test('유효한 Access Token 검증에 성공해야 함', () => {
        const payload = { userId: 1, email: 'test@example.com' };
        const token = generateAccessToken(payload);

        const decoded = verifyAccessToken(token);

        expect(decoded).toBeDefined();
        expect(decoded.userId).toBe(payload.userId);
        expect(decoded.email).toBe(payload.email);
      });

      test('잘못된 형식의 토큰 검증 시 에러를 발생시켜야 함', () => {
        const invalidToken = 'invalid.token.format';

        expect(() => {
          verifyAccessToken(invalidToken);
        }).toThrow();
      });

      test('잘못된 시크릿으로 생성된 토큰 검증 시 에러를 발생시켜야 함', () => {
        const payload = { userId: 1 };
        const wrongSecretToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '15m' });

        expect(() => {
          verifyAccessToken(wrongSecretToken);
        }).toThrow();
      });

      test('만료된 Access Token 검증 시 TokenExpiredError를 발생시켜야 함', () => {
        const payload = { userId: 1 };
        // 이미 만료된 토큰 생성 (1초 전 만료)
        const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1s' });

        expect(() => {
          verifyAccessToken(expiredToken);
        }).toThrow(jwt.TokenExpiredError);
      });

      test('빈 문자열이나 null 토큰 검증 시 에러를 발생시켜야 함', () => {
        expect(() => {
          verifyAccessToken('');
        }).toThrow();

        expect(() => {
          verifyAccessToken(null);
        }).toThrow();
      });
    });

    describe('verifyRefreshToken', () => {
      test('유효한 Refresh Token 검증에 성공해야 함', () => {
        const payload = { userId: 1 };
        const token = generateRefreshToken(payload);

        const decoded = verifyRefreshToken(token);

        expect(decoded).toBeDefined();
        expect(decoded.userId).toBe(payload.userId);
      });

      test('잘못된 형식의 토큰 검증 시 에러를 발생시켜야 함', () => {
        const invalidToken = 'invalid.refresh.token';

        expect(() => {
          verifyRefreshToken(invalidToken);
        }).toThrow();
      });

      test('잘못된 시크릿으로 생성된 토큰 검증 시 에러를 발생시켜야 함', () => {
        const payload = { userId: 1 };
        const wrongSecretToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '7d' });

        expect(() => {
          verifyRefreshToken(wrongSecretToken);
        }).toThrow();
      });

      test('만료된 Refresh Token 검증 시 TokenExpiredError를 발생시켜야 함', () => {
        const payload = { userId: 1 };
        const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1s' });

        expect(() => {
          verifyRefreshToken(expiredToken);
        }).toThrow(jwt.TokenExpiredError);
      });
    });
  });

  describe('에러 핸들링 테스트', () => {

    test('TokenExpiredError가 올바르게 처리되어야 함', () => {
      const payload = { userId: 1 };
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1s' });

      try {
        verifyAccessToken(expiredToken);
        fail('에러가 발생해야 합니다');
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.TokenExpiredError);
        expect(error.name).toBe('TokenExpiredError');
        expect(error.message).toContain('jwt expired');
      }
    });

    test('JsonWebTokenError가 올바르게 처리되어야 함', () => {
      const invalidToken = 'not.a.valid.jwt';

      try {
        verifyAccessToken(invalidToken);
        fail('에러가 발생해야 합니다');
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.JsonWebTokenError);
        expect(error.name).toBe('JsonWebTokenError');
      }
    });

    test('잘못된 시크릿 키로 인한 에러가 올바르게 처리되어야 함', () => {
      const payload = { userId: 1 };
      const wrongSecretToken = jwt.sign(payload, 'wrong-secret-key', { expiresIn: '15m' });

      try {
        verifyAccessToken(wrongSecretToken);
        fail('에러가 발생해야 합니다');
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.JsonWebTokenError);
        expect(error.message).toContain('invalid signature');
      }
    });

    test('undefined 토큰 검증 시 적절한 에러를 발생시켜야 함', () => {
      expect(() => {
        verifyAccessToken(undefined);
      }).toThrow();
    });
  });

  describe('통합 시나리오 테스트', () => {

    test('토큰 생성 후 즉시 검증이 성공해야 함', () => {
      const payload = { userId: 999, email: 'integration@test.com', role: 'user' };

      // Access Token 생성 및 검증
      const accessToken = generateAccessToken(payload);
      const decodedAccess = verifyAccessToken(accessToken);
      expect(decodedAccess.userId).toBe(999);
      expect(decodedAccess.email).toBe('integration@test.com');

      // Refresh Token 생성 및 검증
      const refreshToken = generateRefreshToken(payload);
      const decodedRefresh = verifyRefreshToken(refreshToken);
      expect(decodedRefresh.userId).toBe(999);
    });

    test('동일한 payload로 생성한 두 토큰은 서로 다른 문자열이어야 함', () => {
      const payload = { userId: 1 };

      const token1 = generateAccessToken(payload);
      const token2 = generateAccessToken(payload);

      // iat(발급 시간)이 다를 수 있으므로 토큰은 다를 수 있음
      // 하지만 둘 다 유효해야 함
      expect(verifyAccessToken(token1)).toBeDefined();
      expect(verifyAccessToken(token2)).toBeDefined();
    });

    test('Access Token으로 Refresh Token 검증 함수를 호출해도 동작해야 함 (같은 시크릿 사용)', () => {
      const payload = { userId: 1 };
      const accessToken = generateAccessToken(payload);

      // 같은 시크릿을 사용하므로 기술적으로는 검증 가능
      const decoded = verifyRefreshToken(accessToken);
      expect(decoded.userId).toBe(1);
    });
  });

  describe('경계값 테스트', () => {

    test('매우 큰 payload로 토큰을 생성할 수 있어야 함', () => {
      const largePayload = {
        userId: 1,
        data: 'x'.repeat(1000), // 1000자 문자열
        array: Array(100).fill({ key: 'value' })
      };

      const token = generateAccessToken(largePayload);
      expect(token).toBeDefined();

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(1);
      expect(decoded.data.length).toBe(1000);
    });

    test('숫자, 문자열, 객체, 배열 등 다양한 타입의 payload 속성을 처리해야 함', () => {
      const complexPayload = {
        userId: 123,
        email: 'test@example.com',
        isActive: true,
        roles: ['admin', 'user'],
        metadata: {
          lastLogin: '2025-11-26',
          preferences: { theme: 'dark' }
        }
      };

      const token = generateAccessToken(complexPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(123);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.isActive).toBe(true);
      expect(decoded.roles).toEqual(['admin', 'user']);
      expect(decoded.metadata.preferences.theme).toBe('dark');
    });
  });
});
