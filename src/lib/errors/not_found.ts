import { HttpError } from "./error";

export class NotFoundError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(404, "not_found", message, undefined, paramName);
  }
}
