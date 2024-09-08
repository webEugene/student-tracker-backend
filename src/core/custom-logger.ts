import * as winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

export class CustomLoggerService {
  dailyRotateFileTransport: any = null;
  myFormat: winston.Logform.Format = null;
  createLoggerConfig: winston.LoggerOptions = null;
  constructor() {
    /** A transport for winston which logs to a rotating file based on date**/
    this.dailyRotateFileTransport = new DailyRotateFile({
      filename: `logs/app_log-%DATE%.log`,
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '1d',
    });

    /**
     * Custom log format tailored to our application's requirements
     */
    this.myFormat = winston.format.printf(
      ({ level = 'info', message, timestamp, err, ...metadata }) => {
        const json: any = {
          timestamp,
          level,
          ...metadata,
          message,
          error: {},
        };

        if (err) {
          json.error = err.stack || err;
        }

        return JSON.stringify(json);
      },
    );

    this.createLoggerConfig = {
      level: 'warn', // this will print warn and above level (error also)
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.splat(),
        winston.format.errors(),
        winston.format.json(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        this.myFormat,
      ),

      transports: [
        new winston.transports.Console({ level: 'info' }),
        this.dailyRotateFileTransport,
      ],
    };
  }
}
