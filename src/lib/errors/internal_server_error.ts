import { HttpError } from "./error";

export class InternalServerError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(500, "internal_server_error", message, undefined, paramName);
  }
}
