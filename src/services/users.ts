import { Inject, Service } from "@tsed/common";
import { MongooseModel } from "@tsed/mongoose";
import { UsersModel } from "../db/users";
import { NotFoundError } from "../lib/errors";
import { UserCreateParams } from "../models/user_create";

@Service()
export class UsersService {

  constructor(
    @Inject(UsersModel)
    private usersTable: MongooseModel<UsersModel>) {
  }

  /**
   * Создает пользователя в БД
   * @param params Параметры пользователя
   */
  public async create(params: UserCreateParams) {
    const user = new this.usersTable(params);
    await user.save();
    return user;
  }

  /**
   * Возвращает данные о пользователе по email
   * @param email Почтв пользователя
   */
  public async getByEmail(email: string) {
    const user = await this.usersTable.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundError("Not found user");
    }
    return user;
  }

  /**
   * Сброс пароля пользователя
   * @param email Почта пользователя
   * @param newPassword Новый пароль
   * @param confirmNewPassword Подтверждение нового пароля
   */
  public async resetPassword(email: string, newPassword: string, confirmNewPassword: string) {
    if (newPassword !== confirmNewPassword) {
      throw new Error("newPssword не совпадает с confirmNewPassword");
    }
    await this.usersTable.updateOne({ email }, { password: newPassword });
    return;
  }

  /**
   * Заменяет username у пользователя
   * @param email Почта пользователя
   * @param username Новый username
   */
  public async changeUsername(email: string, username: string) {
    if (!username) {
      throw new Error("Empty username");
    }
    await this.usersTable.updateOne({ email }, { username });
    return;
  }

  /**
   * Удаляет пользователя
   * @param email Почта пользователя
   */
  public async delete(email: string) {
    await this.usersTable.deleteOne({email});
    return;
  }

}
