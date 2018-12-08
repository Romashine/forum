import { HttpError } from "./error";

export class AlreadyExistsError extends HttpError {
  constructor(message: string, paramName?: string) {
    super(401, "already_exists", message, undefined, paramName);
  }
}
