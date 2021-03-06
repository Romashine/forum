import { BodyParams, Controller, Delete, Get, Post, QueryParams, Required, Status, UseBefore } from "@tsed/common";
import { Request, Response } from "@tsed/common";
import { Description, Summary } from "@tsed/swagger";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UsersModel } from "../db/users";
import { CheckAuthMiddleware } from "../middlewares/check_auth";
import { LikesService } from "../services/likes";
import { MessageService } from "../services/message";

@Controller("/messages")
export class MessageController {
  constructor(
    private message: MessageService,
    private likes: LikesService,
  ) { }

  @Post("/")
  @Summary("Create new massage")
  @Description("Создает новое сообщение по теме")
  @Status(201, { description: "Data of message", type: UsersModel })
  @UseBefore(CheckAuthMiddleware)
  public async create(
    @Request() req: ExpressRequest,
    @Required()
    @Description("Text of message")
    @BodyParams("text") text: string,
    @Required()
    @Description("ID of theme")
    @BodyParams("themeId") themeId: string,
  ) {
    const result = await this.message.create(req.user.id, themeId, text);
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
    await this.message.update(req.user.id, id, text);
    res.json({ message: "Text successfully changed" });
  }

  @Get("/list")
  @Summary("Получение списка сообщений")
  @Description("Возвращает список сообщений из темы")
  public async getList(
    @Description("Page")
    @QueryParams("page") page: number,
    @Description("amount")
    @QueryParams("amount") amount: number,
    @Description("ID of theme")
    @QueryParams("themeId") themeId: string,
  ) {
    const list = await this.message.getList(page, amount, themeId);
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
    await this.message.delete(req.user.id, id);
    res.json({ message: "Successfully deleted" });
  }

  @Post("/like")
  @Summary("Create like in message")
  @Description("Create like in message")
  @UseBefore(CheckAuthMiddleware)
  public async createLike(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Required()
    @Description("ID of message")
    @BodyParams("messageId") id: string,
  ) {
    await this.likes.create(req.user.id, id);
    res.json({ message: "Like successfully added" });
  }

  @Get("/like")
  @Summary("Получение списка лайков")
  @Description("Возвращает список лайков для сообщения")
  public async getListLikes(
    @Description("Page")
    @QueryParams("page") page: number,
    @Description("amount")
    @QueryParams("amount") amount: number,
    @Description("ID of message")
    @QueryParams("messageId") messageId: string,
  ) {
    const list = await this.likes.getList(page, amount, messageId);
    return list;
  }

  @Delete("/like")
  @Summary("Удаление лайка")
  @Description("Удаляет like")
  @UseBefore(CheckAuthMiddleware)
  public async deleteLike(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Description("ID of message")
    @BodyParams("messageId") id: string,
  ) {
    await this.likes.delete(req.user.id, id);
    res.json({ message: "Successfully deleted" });
  }

}
