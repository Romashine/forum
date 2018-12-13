import { JsonProperty } from "@tsed/common";
import { Model, Unique } from "@tsed/mongoose";

@Model()
export class LikesModel {

  @Unique()
  public _id!: string;

  @JsonProperty()
  public userId!: string;

  @JsonProperty()
  public messageId!: string;

}
