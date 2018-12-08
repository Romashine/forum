import { HttpError } from "./error";

export class AccessDeniedError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(401, "access_denied", message, undefined, paramName);
  }
}
