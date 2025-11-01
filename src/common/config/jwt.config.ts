import { registerAs } from '@nestjs/config';

export default registerAs('jwt_service', () => ({
  // JWT Secret Key: Token'ları imzalamak ve doğrulamak için kullanılır.
  secret: process.env.JWT_SECRET || 'super_secret_key_change_me_in_production',

  // Access Token Ayarları
  // Access token'ın geçerlilik süresi.
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',

  // Refresh Token Ayarları
  // Refresh token'ın geçerlilik süresi.
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // JWT algoritması
  // algorithm: process.env.JWT_ALGORITHM || 'HS256',
}));
