import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getSecretKey } from '../utils/jwt';

export interface AuthSession {
  userId: number;
  username: string;
  role: 'ADMIN' | 'OFFICIER';
}

export function authGuard(roles?: ('ADMIN' | 'OFFICIER')[]) {
  return (handler: (req: NextRequest, session: AuthSession, params?: any) => Promise<NextResponse>) => {
    return async (req: NextRequest, context?: any) => {
      const token = req.cookies.get('session')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }

      try {
        const decoded = jwt.verify(token, getSecretKey()) as any;
        
        // Map token payload (id) to session interface (userId)
        const session: AuthSession = {
          userId: decoded.id || decoded.userId,
          username: decoded.username,
          role: decoded.role
        };
        
        if (roles && roles.length > 0 && !roles.includes(session.role)) {
          return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
        }

        // Extract params from context for Next.js 15+ 
        const params = context?.params;
        return await handler(req, session, params);
      } catch (error) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
      }
    };
  };
}
