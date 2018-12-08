import { HttpError } from "./error";

export class UnauthorizedError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(401, "unauthorized", message, undefined, paramName);
  }
}
