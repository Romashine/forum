import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { LikesModel } from "../db/likes";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import { LikeCreateParams } from "../models/like_create";

@Service()
export class LikesService {

  constructor(
    @Inject(LikesModel)
    private likesTable: MongooseModel<LikesModel>,
  ) {
  }

  /**
   * Добавляет like сообщению
   * @param userId ID of user
   * @param messageId ID of theme
   */
  public async create(userId: string, messageId: string) {
    const user = await this.likesTable.findOne({ userId });
    if (user) {
      throw new Error("You can not give second like");
    }
    const params: LikeCreateParams = {
      messageId,
      userId,
    };
    const like = new this.likesTable(params);
    await like.save();
    return like;
  }

  /**
   * Возвращает данные о лайке по ID
   * @param id Like ID
   */
  public async getById(id: string) {
    const like = await this.likesTable.findOne({ _id: id }).exec();
    if (!like) {
      throw new NotFoundError("Not found like");
    }
    return like;
  }

  /**
   * Удаляет like
   * @param id ID of message
   */
  public async delete(userId: string, id: string) {
    await this.checkRulse(userId, id);
    await this.likesTable.deleteOne({ _id: id });
    return;
  }
  /**
   * Удаляет все лайки из сообщения
   * @param id ID of message
   */
  public async deleteAllFromMessage(id: string) {
    await this.likesTable.deleteMany({ messageId: id });
    return;
  }

  /**
   * Возвращает список лайков сообщения
   * @param page Страницы
   * @param amount Кол-во отображаемых записей на странице (0 - показать все)
   * @param amount Кол-во отображаемых записей на странице (0 - показать все)
   */
  public async getList(page: number | 0, amount: number | 3, messageId: string) {
    const skip = page * amount;
    const limit = amount;
    const list = await this.likesTable.find({ messageId }, null, { limit, skip });
    return list;
  }

  /**
   * Сравнивает userId пользователя с userId в message
   * @param userId userId пользователя
   * @param id ID of message
   */
  private async checkRulse(userId: string, id: string) {
    const theme = await this.getById(id);
    if (userId !== theme.userId) {
      throw new UnauthorizedError("You have not rules");
    }
    return;
  }

}
