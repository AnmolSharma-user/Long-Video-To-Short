import { toast } from "@/components/ui/use-toast";

interface ErrorDetails {
  message: string;
  code?: string;
  context?: Record<string, any>;
  stack?: string;
}

interface ErrorLoggerOptions {
  notify?: boolean;
  context?: Record<string, any>;
  level?: "error" | "warning" | "info";
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private readonly isDevelopment = process.env.NODE_ENV === "development";

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public log(
    error: Error | string,
    options: ErrorLoggerOptions = {}
  ): ErrorDetails {
    const errorDetails = this.formatError(error, options.context);
    
    // Log to console in development
    if (this.isDevelopment) {
      this.logToConsole(errorDetails, options.level);
    }

    // Send to error tracking service in production
    if (!this.isDevelopment) {
      this.sendToErrorTrackingService(errorDetails);
    }

    // Show toast notification if requested
    if (options.notify) {
      this.notifyUser(errorDetails);
    }

    return errorDetails;
  }

  private formatError(
    error: Error | string,
    context?: Record<string, any>
  ): ErrorDetails {
    if (typeof error === "string") {
      return {
        message: error,
        context,
        stack: new Error().stack,
      };
    }

    // Extract error code if available
    const code = (error as any).code || (error as any).statusCode || undefined;

    return {
      message: error.message,
      code,
      context,
      stack: error.stack,
    };
  }

  private logToConsole(
    error: ErrorDetails,
    level: "error" | "warning" | "info" = "error"
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "error":
        console.error(prefix, error);
        break;
      case "warning":
        console.warn(prefix, error);
        break;
      case "info":
        console.info(prefix, error);
        break;
    }

    if (error.context) {
      console.log(`${prefix} Context:`, error.context);
    }

    if (error.stack && level === "error") {
      console.log(`${prefix} Stack trace:`, error.stack);
    }
  }

  private sendToErrorTrackingService(error: ErrorDetails): void {
    // TODO: Implement error tracking service integration
    // Example with Sentry:
    // Sentry.captureException(error);
  }

  private notifyUser(error: ErrorDetails): void {
    const title = error.code ? `Error (${error.code})` : "Error";
    
    toast({
      title,
      description: this.formatUserMessage(error.message),
      variant: "destructive",
    });
  }

  private formatUserMessage(message: string): string {
    // Clean up error message for user display
    return message
      .replace(/\b[A-Z0-9]{24}\b/g, "ID") // Hide IDs
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "email") // Hide emails
      .replace(/\b(?:\d[ -]*?){13,16}\b/g, "card number") // Hide card numbers
      .replace(/(password|secret|key|token)s?\b[^a-z]*?:.*?[,}]/gi, "$1: [HIDDEN]"); // Hide sensitive data
  }

  public captureException(error: Error, context?: Record<string, any>): void {
    this.log(error, { context });
  }

  public captureMessage(message: string, context?: Record<string, any>): void {
    this.log(message, { context, level: "info" });
  }

  public withErrorLogging<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: ErrorLoggerOptions = {}
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.log(error as Error, options);
        throw error;
      }
    }) as T;
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Utility function to wrap async functions with error logging
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorLoggerOptions = {}
): T {
  return errorLogger.withErrorLogging(fn, options);
}

export type { ErrorDetails, ErrorLoggerOptions };