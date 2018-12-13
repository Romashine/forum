import { JsonProperty, Required } from "@tsed/common";

export class LikeCreateParams {

  @Required()
  @JsonProperty()
  public userId!: string;

  @Required()
  @JsonProperty()
  public messageId!: string;

}
