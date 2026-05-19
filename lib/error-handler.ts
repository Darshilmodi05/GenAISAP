import { NextResponse } from 'next/server';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service error', details?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

// Error response formatter
export function formatErrorResponse(error: AppError | Error): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details && { details: error.details }),
        },
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Handle unexpected errors
  const statusCode = 500;
  const errorCode = 'INTERNAL_ERROR';
  
  return NextResponse.json(
    {
      error: {
        code: errorCode,
        message: error.message || 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

// Success response formatter
export function formatSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

// Error logging utility
export function logError(
  error: Error | AppError,
  context: {
    userId?: string;
    tenantId?: string;
    endpoint?: string;
    method?: string;
    requestId?: string;
    [key: string]: any;
  } = {}
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message: error.message,
    stack: error.stack,
    code: error instanceof AppError ? error.code : 'INTERNAL_ERROR',
    context,
  };

  // Log to console (in production, this would go to a logging service)
  console.error(JSON.stringify(logData, null, 2));

  // In production, you might want to send this to:
  // - Error tracking service (Sentry, Bugsnag, etc.)
  // - Logging service (DataDog, LogRocket, etc.)
  // - Internal monitoring system
}

// Warning logging utility
export function logWarning(
  message: string,
  context: {
    userId?: string;
    tenantId?: string;
    endpoint?: string;
    method?: string;
    requestId?: string;
    [key: string]: any;
  } = {}
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'WARNING',
    message,
    context,
  };

  console.warn(JSON.stringify(logData, null, 2));
}

// Info logging utility
export function logInfo(
  message: string,
  context: {
    userId?: string;
    tenantId?: string;
    endpoint?: string;
    method?: string;
    requestId?: string;
    [key: string]: any;
  } = {}
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message,
    context,
  };

  console.info(JSON.stringify(logData, null, 2));
}

// Debug logging utility
export function logDebug(
  message: string,
  context: {
    userId?: string;
    tenantId?: string;
    endpoint?: string;
    method?: string;
    requestId?: string;
    [key: string]: any;
  } = {}
): void {
  if (process.env.NODE_ENV === 'development') {
    const logData = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message,
      context,
    };

    console.debug(JSON.stringify(logData, null, 2));
  }
}

// Request context helper
export function getRequestContext(request: Request) {
  return {
    requestId: crypto.randomUUID(),
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown',
    timestamp: new Date().toISOString(),
  };
}
