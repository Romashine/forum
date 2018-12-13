import { Err, IMiddlewareError, MiddlewareError, Response } from "@tsed/common";
import { Response as ExpressResponse } from "express";
import { HttpError, InternalServerError, NotFoundError } from "../lib/errors";

/**
 * Оборачивает все ошибки в JSON.
 * Ошибки вида "string" оборачиваются в ошибку с кодом 404.
 * Сторонние ошибки оборачиваются в ошибку с кодом 500.
 */
@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

  public use(
    @Err() error: any,
    @Response() response: ExpressResponse,
  ): any {

    if (typeof error === "string") {
      return response.status(404).json(new NotFoundError(error));
    }

    if (error.status) {
      return response.status(error.status).json(error);
    }

    if (error instanceof HttpError) {
      return response.status(error.status).json(error);
    }

    return response.status(500).json(new InternalServerError(error.message));

  }
}
