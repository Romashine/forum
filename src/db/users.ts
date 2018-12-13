import { JsonProperty } from "@tsed/common";
import { Model, Unique } from "@tsed/mongoose";

@Model()
export class UsersModel {

  @Unique()
  public id!: string;

  @JsonProperty()
  @Unique()
  public email!: string;

  @JsonProperty()
  public username!: string;

  @JsonProperty()
  public password!: string;

}
