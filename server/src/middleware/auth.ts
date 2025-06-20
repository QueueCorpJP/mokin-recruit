import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: 'CANDIDATE' | 'COMPANY_USER' | 'ADMIN';
    companyGroupId?: string;
    permissionLevel?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('認証トークンが必要です', 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new CustomError('JWT設定エラー', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType,
      companyGroupId: decoded.companyGroupId,
      permissionLevel: decoded.permissionLevel,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('無効な認証トークンです', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new CustomError('認証トークンの有効期限が切れています', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('認証が必要です', 401);
    }

    if (!allowedRoles.includes(req.user.userType)) {
      throw new CustomError('この操作を実行する権限がありません', 403);
    }

    next();
  };
};

export const requirePermission = (requiredPermission: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('認証が必要です', 401);
    }

    if (req.user.userType === 'COMPANY_USER' && req.user.permissionLevel !== requiredPermission) {
      throw new CustomError('この操作を実行する権限がありません', 403);
    }

    next();
  };
}; 