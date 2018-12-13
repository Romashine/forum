import { BodyParams, Controller, Delete, Get, Post, QueryParams, Required, Status, UseBefore } from "@tsed/common";
import { Request, Response } from "@tsed/common";
import { Description, Returns, Summary } from "@tsed/swagger";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UsersModel } from "../db/users";
import { HttpError } from "../lib/errors";
import { CheckAuthMiddleware } from "../middlewares/check_auth";
import { UserCreateParams } from "../models/user_create";
import { MessageService } from "../services/message";

@Controller("/messages")
export class MessageController {
  constructor(
    private messages: MessageService,
  ) { }

  @Post("/")
  @Summary("Create new massage")
  @Description("Создает новое сообщение по теме")
  @Status(201, { description: "Data of message", type: UsersModel })
  @UseBefore(CheckAuthMiddleware)
  public async create(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Required()
    @Description("Text of message")
    @BodyParams("text") text: string,
    @Required()
    @Description("ID of theme")
    @BodyParams("themeId") themeId: string,
  ) {
    const result = await this.messages.create(req.user.id, themeId, text);
    return result;
  }

  @Post("/update")
  @Summary("Change text of message")
  @Description("Change text of message on new text")
  @UseBefore(CheckAuthMiddleware)
  public async update(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Required()
    @Description("ID of message")
    @BodyParams("messageId") id: string,
    @Required()
    @Description("New text")
    @BodyParams("text") text: string,
  ) {
    const result = await this.messages.update(req.user.id, id, text);
    res.json({ message: "Text successfully changed" });
  }

  @Get("/list")
  @Summary("Получение списка сообщений")
  @Description("Возвращает список сообщений из темы")
  public async getList(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Description("Page")
    @QueryParams("page") page: number,
    @Description("amount")
    @QueryParams("amount") amount: number,
    @Description("ID of theme")
    @QueryParams("themeId") themeId: string,
  ) {
    const list = await this.messages.getList(page, amount, themeId);
    return list;
  }

  @Delete("/delete")
  @Summary("Удаление message")
  @Description("Удаляет message")
  @UseBefore(CheckAuthMiddleware)
  public async delete(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Description("ID of message")
    @BodyParams("messageId") id: string,
  ) {
    await this.messages.delete(req.user.id, id);
    res.json({ message: "Successfully deleted" });
  }

}
