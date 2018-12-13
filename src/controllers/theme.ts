import { BodyParams, Controller, Delete, Get, Post, QueryParams, Required, Status, UseBefore } from "@tsed/common";
import { Request, Response } from "@tsed/common";
import { Description, Summary } from "@tsed/swagger";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UsersModel } from "../db/users";
import { CheckAuthMiddleware } from "../middlewares/check_auth";
import { ThemeService } from "../services/theme";

@Controller("/theme")
export class ThemeController {
  constructor(
    private theme: ThemeService,
  ) { }

  @Post("/")
  @Summary("Create new theme")
  @Description("Создает новую тему на форуме")
  @Status(201, { description: "Data of theme", type: UsersModel })
  @UseBefore(CheckAuthMiddleware)
  public async create(
    @Request() req: ExpressRequest,
    @Required()
    @Description("Заголовок темы")
    @BodyParams("title") title: string,
  ) {
    const result = await this.theme.create(req.user.id, title);
    return result;
  }

  @Post("/update")
  @Summary("Change title of theme")
  @Description("Change title of theme on new title")
  @UseBefore(CheckAuthMiddleware)
  public async update(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Description("ID of theme")
    @BodyParams("themeId") id: string,
    @Description("New title")
    @BodyParams("title") title: string,
  ) {
    await this.theme.update(req.user.id, id, title);
    res.json({ message: "Title successfully changed" });
  }

  @Get("/list")
  @Summary("Получение списка тем")
  @Description("Возвращает список тем")
  public async getList(
    @Description("Page")
    @QueryParams("page") page: number,
    @Description("amount")
    @QueryParams("amount") amount: number,
  ) {
    const list = await this.theme.getList(page, amount);
    return list;
  }

  @Delete("/delete")
  @Summary("Удаление theme")
  @Description("Удаляет theme")
  @UseBefore(CheckAuthMiddleware)
  public async delete(
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
    @Description("ID of theme")
    @BodyParams("themeId") id: string,
  ) {
    await this.theme.delete(req.user.id, id);
    res.json({ message: "Successfully deleted" });
  }

}
