// Lightweight Logging Service for Development

const IS_PROD = import.meta.env.PROD;

export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    if (!IS_PROD) {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  },
  warn: (message: string, ...optionalParams: any[]) => {
    if (!IS_PROD) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...optionalParams);
    }
  },
  error: (message: string, ...optionalParams: any[]) => {
    // Error logs are always enabled to diagnose issues, but minimal in prod
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, ...optionalParams);
  },
  auth: (action: string, email?: string, status: 'success' | 'failed' | 'attempt' = 'success') => {
    if (!IS_PROD) {
      const icon = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚡';
      console.log(
        `%c${icon} [AUTH] [${action.toUpperCase()}] Email: ${email || 'OAuth'} | Status: ${status}`,
        'color: #6366f1; font-weight: bold;'
      );
    }
  }
};
