import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { ThemeModel } from "../db/theme";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import { ThemeCreateParams } from "../models/theme_create";
import { UsersService } from "./users";

@Service()
export class ThemeService {

  constructor(
    private usersTable: UsersService,
    @Inject(ThemeModel)
    private themeTable: MongooseModel<ThemeModel>,
  ) {
  }

  /**
   * Создает тему форума
   * @param userId ID of user
   * @param title Title of theme
   */
  public async create(userId: string, title: string) {
    const params: ThemeCreateParams = {
      userId,
      title,
    };
    const theme = new this.themeTable(params);
    await theme.save();
    return theme;
  }

  /**
   * Возвращает данные о theme по ID
   * @param id Theme ID
   */
  public async getById(id: string) {
    const theme = await this.themeTable.findOne({ _id: id }).exec();
    if (!theme) {
      throw new NotFoundError("Not found theme");
    }
    return theme;
  }

  /**
   * Изменяет title у theme
   * @param userId ID of user
   * @param id ID of theme
   * @param title Title of theme
   */
  public async update(userId: string, id: string, title: string) {
    if (!title) {
      throw new Error("Empty title");
    }
    await this.checkRulse(userId, id);
    await this.themeTable.updateOne({ _id: id }, { title });
    return;
  }

  /**
   * Удаляет тему
   * @param id ID of theme
   */
  public async delete(userId: string, id: string) {
    await this.checkRulse(userId, id);
    await this.themeTable.deleteOne({ _id: id });
    return;
  }

  public async getList(page: number | 0, amount: number | 3) {
  const skip = page * amount;
  const limit = amount;
  const list = await this.themeTable.find({}, null, { limit, skip });
  return list;
}

  /**
   * Сравнивает userId пользователя с userId в theme
   * @param userId userId пользователя
   * @param id ID of theme
   */
  private async checkRulse(userId: string, id: string) {
  const theme = await this.getById(id);
  if (userId !== theme.userId) {
    throw new UnauthorizedError("You have not rules");
  }
  return;
}

}
