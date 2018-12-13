import { JsonProperty, MinLength, Required } from "@tsed/common";

export class MessageCreateParams {

  @Required()
  @JsonProperty()
  public userId!: string;

  @Required()
  @JsonProperty()
  public themeId!: string;

  @Required()
  @JsonProperty()
  @MinLength(1)
  public text!: string;
}
