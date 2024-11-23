import { PostgrestError } from "@supabase/postgrest-js";

export interface DatabaseErrorDetails {
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
}

export class DatabaseError extends Error {
  public code: string;
  public details: string | null;
  public hint: string | null;
  public status: number;

  constructor(error: DatabaseErrorDetails) {
    super(error.message);
    this.name = "DatabaseError";
    this.code = error.code;
    this.details = error.details;
    this.hint = error.hint;
    this.status = 500;

    // Handle specific error codes
    switch (error.code) {
      case "23505": // unique_violation
        this.message = "This record already exists.";
        this.status = 409;
        break;
      case "23503": // foreign_key_violation
        this.message = "Referenced record does not exist.";
        this.status = 404;
        break;
      case "23514": // check_violation
        this.message = "Invalid data provided.";
        this.status = 400;
        break;
      case "42P01": // undefined_table
        this.message = "Database table not found.";
        this.status = 500;
        break;
      case "42703": // undefined_column
        this.message = "Invalid field specified.";
        this.status = 400;
        break;
      case "28000": // invalid_authorization_specification
      case "28P01": // invalid_password
        this.message = "Authentication failed.";
        this.status = 401;
        break;
      case "42501": // insufficient_privilege
        this.message = "You don't have permission to perform this action.";
        this.status = 403;
        break;
      case "PGRST116": // not_found
        this.message = "Record not found.";
        this.status = 404;
        break;
      default:
        this.message = "An unexpected database error occurred.";
        this.status = 500;
    }
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        status: this.status,
        details: this.details,
        hint: this.hint,
      },
    };
  }
}

export class ValidationError extends Error {
  public status: number;
  public errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.errors = errors;
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
        errors: this.errors,
      },
    };
  }
}

export class NotFoundError extends Error {
  public status: number;

  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.status = 404;
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
      },
    };
  }
}

export class AuthorizationError extends Error {
  public status: number;

  constructor(message = "You don't have permission to perform this action") {
    super(message);
    this.name = "AuthorizationError";
    this.status = 403;
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
      },
    };
  }
}

export class InsufficientCreditsError extends Error {
  public status: number;
  public required: number;
  public available: number;

  constructor(required: number, available: number) {
    super(`Insufficient credits. Required: ${required}, Available: ${available}`);
    this.name = "InsufficientCreditsError";
    this.status = 402;
    this.required = required;
    this.available = available;
  }

  public toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
        required: this.required,
        available: this.available,
      },
    };
  }
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof PostgrestError) {
    throw new DatabaseError({
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("An unexpected error occurred");
}

export function handleValidationError(message: string, errors: Record<string, string>): never {
  throw new ValidationError(message, errors);
}

export function handleNotFoundError(resource: string): never {
  throw new NotFoundError(resource);
}

export function handleAuthorizationError(message?: string): never {
  throw new AuthorizationError(message);
}

export function handleInsufficientCreditsError(required: number, available: number): never {
  throw new InsufficientCreditsError(required, available);
}