import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { MessageModel } from "../db/message";
import { NotFoundError, UnauthorizedError } from "../lib/errors";
import { MessageCreateParams } from "../models/message_create";

@Service()
export class MessageService {

  constructor(
    @Inject(MessageModel)
    private messageTable: MongooseModel<MessageModel>,
  ) {
  }

  /**
   * Создает сщщбщение в теме форума
   * @param userId ID of user
   * @param themeId ID of theme
   * @param text Text of message
   */
  public async create(userId: string, themeId: string, text: string) {
    const params: MessageCreateParams = {
      themeId,
      userId,
      text,
    };
    const message = new this.messageTable(params);
    await message.save();
    return message;
  }

  /**
   * Возвращает данные о сообщении по ID
   * @param id Message ID
   */
  public async getById(id: string) {
    const message = await this.messageTable.findOne({ _id: id }).exec();
    if (!message) {
      throw new NotFoundError("Not found message");
    }
    return message;
  }

  /**
   * Изменяет text у message
   * @param userId ID of user
   * @param id ID of message
   * @param text Text of theme
   */
  public async update(userId: string, id: string, text: string) {
    if (!text) {
      throw new Error("Empty text");
    }
    await this.checkRulse(userId, id);
    await this.messageTable.updateOne({ _id: id }, { text });
    return;
  }

  /**
   * Удаляет сообщение
   * @param id ID of message
   */
  public async delete(userId: string, id: string) {
    await this.checkRulse(userId, id);
    await this.messageTable.deleteOne({ _id: id });
    return;
  }
  /**
   * Удаляет сообщения темы
   * @param id ID of theme
   */
  public async deleteTheme(id: string) {
    await this.messageTable.deleteMany({ themeId: id });
    return;
  }

  /**
   * Возвращает список сообщений темы
   * @param page Страницы
   * @param amount Кол-во отображаемых записей на странице (0 - показать все)
   * @param amount Кол-во отображаемых записей на странице (0 - показать все)
   */
  public async getList(page: number | 0, amount: number | 3, themeId: string) {
    const skip = page * amount;
    const limit = amount;
    const list = await this.messageTable.find({ themeId }, null, { limit, skip });
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
