import { BodyParams, Controller, Delete, Get, Post, Required, Status, UseBefore } from "@tsed/common";
import { Request, Response } from "@tsed/common";
import { Description, Returns, Summary } from "@tsed/swagger";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UsersModel } from "../db/users";
import { HttpError } from "../lib/errors";
import { CheckAuthMiddleware } from "../middlewares/check_auth";
import { UserCreateParams } from "../models/user_create";
import { UsersService } from "../services/users";

@Controller("/users")
export class UsersController {
  constructor(
    private users: UsersService,
  ) { }

  @Post("/")
  @Summary("Регистрация нового пользователя")
  @Description("Создает пользователя по параметрам")
  @Status(201, { description: "Data of user", type: UsersModel })
  public async create(
    @Description("Параметры пользователя")
    @BodyParams() body: UserCreateParams,
  ) {
    const result = await this.users.create(body);
    return result;
  }

  @Get("/")
  @Summary("Получение данных о пользователе")
  @Description("Возвращает данные о пользователе")
  @Status(201, { description: "Data of user", type: UsersModel })
  @Returns(404, { description: "Not found", type: HttpError })
  @UseBefore(CheckAuthMiddleware)
  public async getByEmail(
    @Request() req: ExpressRequest,
  ) {
    const result = await this.users.getByEmail(req.user.email);
    return result;
  }

  @Post("/reset_password")
  @Summary("Сброс пароля на новый")
  @Description("Заменяет старый пароль на новый")
  @UseBefore(CheckAuthMiddleware)
  public async reset(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Required()
    @BodyParams("newPassword") newPassword: string,
    @Required()
    @BodyParams("confirmNewPassword") confirmNewPassword: string,
  ) {
    await this.users.resetPassword(req.user.email, newPassword, confirmNewPassword);
    res.json({ message: "Password successfully changed" });
  }

  @Post("/change_username")
  @Summary("Change username of user")
  @Description("Change username of user on new username")
  @UseBefore(CheckAuthMiddleware)
  public async changeUsername(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Required()
    @Description("New username")
    @BodyParams("newUsername") newUsername: string,
  ) {
    await this.users.changeUsername(req.user.email, newUsername);
    res.json({ message: "Username successfully changed" });
  }

  @Delete("/delete")
  @Summary("Удаление пользователя")
  @Description("Удаляет пользователя")
  @UseBefore(CheckAuthMiddleware)
  public async delete(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    await this.users.delete(req.user.email);
    res.json({ message: "Successfully deleted" });
  }

}
