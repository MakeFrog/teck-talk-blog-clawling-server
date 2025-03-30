// src/utils/logger.ts
export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
  }
}
