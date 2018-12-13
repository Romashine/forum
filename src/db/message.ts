import { JsonProperty } from "@tsed/common";
import { Model, Unique } from "@tsed/mongoose";

@Model()
export class MessageModel {

  @Unique()
  public _id!: string;

  @JsonProperty()
  public userId!: string;

  @JsonProperty()
  public themeId!: string;

  @JsonProperty()
  public text!: string;

}
