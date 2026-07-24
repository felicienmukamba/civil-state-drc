import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback_secret';

export class AuthService {
  async login(username: string, password_raw: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Identifiants incorrects');
    }
    
    const isValid = await bcrypt.compare(password_raw, user.password_hash);
    if (!isValid) {
      throw new Error('Identifiants incorrects');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

export const authService = new AuthService();
