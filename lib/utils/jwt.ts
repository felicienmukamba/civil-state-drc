/**
 * Centralized JWT secret management
 * Ensures consistent secret usage across the application
 */

function getSecretKey(): string {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in production environment. This is a security risk.');
  }
  return process.env.JWT_SECRET || 'super-secret-key-for-dev';
}

export { getSecretKey };
