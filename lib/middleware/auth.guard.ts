import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export interface AuthSession {
  userId: number;
  username: string;
  role: 'ADMIN' | 'OFFICIER';
}

export function authGuard(roles?: ('ADMIN' | 'OFFICIER')[]) {
  return (handler: (req: NextRequest, session: AuthSession) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const token = req.cookies.get('session')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
        
        if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
          return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
        }

        return await handler(req, decoded);
      } catch (error) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
      }
    };
  };
}
