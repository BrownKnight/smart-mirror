export declare type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export declare type JSLogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export declare type LogTransport = (level: LogLevel, loggerName: string, message: string) => void;


export interface ILogger {
    /**
     * Log trace message
     * This will also include a full stack trace
     *
     * @param msg any data to log to the console
     */
    trace(...msg: any[]): void;
    /**
     * Log debug message
     *
     * @param msg any data to log to the console
     */
    debug(...msg: any[]): void;
    /**
     * Log info message
     *
     * @param msg any data to log to the console
     */
    info(...msg: any[]): void;
    /**
     * Log warn message
     *
     * @param msg any data to log to the console
     */
    warn(...msg: any[]): void;
    /**
     * Log error message
     *
     * @param msg any data to log to the console
     */
    error(...msg: any[]): void;
}

export class Logger implements ILogger {
    /**
     * Log trace message
     * This will also include a full stack trace
     *
     * @param msg any data to log to the console
     */
    public trace(...msg: any[]): void {
        console.log(msg)
    }
    /**
     * Log debug message
     *
     * @param msg any data to log to the console
     */
    public debug(...msg: any[]): void {
        console.log(msg)
    }
    /**
     * Log info message
     *
     * @param msg any data to log to the console
     */
    public info(...msg: any[]): void {
        console.log(msg)
    }
    /**
     * Log warn message
     *
     * @param msg any data to log to the console
     */
    public warn(...msg: any[]): void {
        console.log(msg)
    }
    /**
     * Log error message
     *
     * @param msg any data to log to the console
     */
    public error(...msg: any[]): void {
        console.log(msg)
    }
}

export class LoggerFactory {
    static logger: ILogger;
    
    static getLogger(name: string) {
        if (!this.logger) {
            this.logger = new Logger();
        }
        return this.logger
    }
}

