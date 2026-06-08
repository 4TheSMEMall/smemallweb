/**
 * Domain errors are pure business rule violations.
 * They carry a code so the presentation layer can map them
 * to the correct HTTP status without knowing business logic.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>
  ) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}
