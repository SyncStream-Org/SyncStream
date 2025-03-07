import * as winston from 'winston';
import 'dotenv/config';

enum LogLevel {
  Silent = 0,
  Info = 1,
  Debug = 2,
}

/**
 * Logger class for handling application logs.
 */
export default class Logger {
  private loggerMain: winston.Logger;
  private loggerDebug: winston.Logger;
  private loggerError: winston.Logger;
  private logLevel: LogLevel;
  private logFileName: string | undefined;

  /**
   * Create a new Logger instance.
   * @constructor
   */
  public constructor(logDestination: string) {
    this.logLevel = this.getLogLevelFromEnv() || LogLevel.Debug;
    this.logFileName = logDestination;

    // Check if LOG_FILE is defined; exit with code 1 if not
    if (!this.logFileName) {
      console.log("log destination not set");
      process.exit(1);
    }

    const customFormat = winston.format.printf(({ timestamp, message }) => {
      return `${timestamp} ${message}`;
    });

    const fileTransportOptions: winston.transports.FileTransportOptions = {
      filename: this.logFileName,
    };

    this.loggerMain = winston.createLogger({
      level: this.logLevel >= LogLevel.Info ? 'info' : 'silent',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
        customFormat
      ),
      transports: [
        new winston.transports.File({ ...fileTransportOptions, format: customFormat }),
      ],
    });

    this.loggerDebug = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
        customFormat
      ),
      transports: [
        new winston.transports.File({ ...fileTransportOptions, format: customFormat }),
      ],
    });

    this.loggerError = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }), // Use the custom format with timezone information
        customFormat
      ),
      transports: [
        new winston.transports.File({ ...fileTransportOptions, format: customFormat }),
      ],
    });
  }

  /**
   * Get the log level from the environment variable LOG_LEVEL.
   * @private
   */
  private getLogLevelFromEnv(): LogLevel {
    const logLevel = process.env.LOG_LEVEL;

    switch (logLevel) {
      case '0':
        return LogLevel.Silent;
      case '2':
        return LogLevel.Debug;
      case '1':
      default:
        return LogLevel.Info;
    }
  }

  /**
   * Log a debug message.
   * @param {string} message - The debug message to log.
   */
  debug(message: string): void {
    console.log(message);
    if (this.logLevel >= LogLevel.Debug) {
      this.loggerDebug.debug(message);
    }
  }

  /**
   * Log an information message.
   * @param {string} message - The information message to log.
   */
  info(message: string): void {
    if (this.logLevel >= LogLevel.Info) {
      this.loggerMain.info(message);
    }
  }

  /**
   * Log a warning message.
   * @param {string} message - The warning message to log.
   */
  warn(message: string): void {
    console.log(message);
    if (this.logLevel >= LogLevel.Info) {
      this.loggerMain.warn(message);
    }
  }

  /**
   * Log an error message.
   * @param {string} message - The error message to log.
   */
  error(message: string): void {
    this.loggerError.error(message);
  }
}
