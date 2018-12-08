import { HttpError } from "./error";

export class BadRequestError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(400, "bad_request", message, undefined, paramName);
  }
}
