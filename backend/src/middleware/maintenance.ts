import { Request, Response, NextFunction } from 'express';
import { Config } from '../models/Config';

/**
 * Maintenance Mode Middleware
 * Blocks non-admin access when maintenanceMode is true.
 */
export const maintenanceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const maintenanceConfig = await Config.findOne({ key: 'maintenanceMode' });
    const isMaintenance = maintenanceConfig ? (maintenanceConfig.value === 'true' || maintenanceConfig.value === true) : false;

    if (isMaintenance) {
      const user = (req as any).user;
      const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

      // Allow admins and super admins to bypass
      if (isAdmin) {
        return next();
      }

      // Allow branding query and login mutation so users can see maintenance info and admins can log in
      const body = req.body || {};
      const query = body.query || '';
      const operationName = body.operationName || '';

      const isExempt = 
        operationName === 'GetBranding' || 
        operationName === 'LoginUser' || 
        operationName === 'Verify2FA' || 
        operationName === 'VerifyEmailOTP' ||
        query.includes('branding') ||
        query.includes('login') ||
        query.includes('verify2FA') ||
        query.includes('verifyEmailOTP');

      if (isExempt) {
        return next();
      }

      // Block everything else
      return res.status(503).json({
        errors: [{
          message: 'SITE_MAINTENANCE',
          extensions: {
            code: 'SERVICE_UNAVAILABLE',
            http: { status: 503 }
          }
        }],
        message: 'The site is currently in development/maintenance mode. Only administrators can access this area.'
      });
    }

    next();
  } catch (error) {
    // If DB check fails, default to allowing to avoid locking out the site
    next();
  }
};
