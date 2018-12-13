/// <reference path="../types/index.d.ts" />

import { IMiddleware, Middleware, Request } from "@tsed/common";
import { Request as ExpressRequest } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../lib/errors";
import { UsersService } from "../services/users";

/**
 * Проверяет наличие значения basic authorization в headers и сверяет его валидность.
 * Выдает ошибку "No basic authorization was found" если не найден в headers basic authorization.
 * Выдает ошибку "Not found user" если нет в БД польщователя с такой почтой
 * Выдает ошибку "Invalid password" если указан неверный пароль
 */
@Middleware()
export class CheckAuthMiddleware implements IMiddleware {

  constructor(
    private users: UsersService,
  ) { }

  public async use(@Request() req: ExpressRequest) {
    if (!req.headers.authorization) {
      throw new BadRequestError("No basic authorization was found");
    }

    // Декодирование BasicAuthorithation
    const b64auth = (req.headers.authorization).split(" ")[1];
    const strauth = Buffer.from(b64auth, "base64").toString();
    const splitIndex = strauth.indexOf(":");
    const login = strauth.substring(0, splitIndex);
    const password = strauth.substring(splitIndex + 1);

    // Логинация
    const user = await this.users.getByEmail(login);
    if (!user || user.password !== password) {
      throw new UnauthorizedError("Invalid password");
    }

    req.user = user;
  }
}
