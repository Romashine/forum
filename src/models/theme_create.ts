import { JsonProperty, MinLength, Required } from "@tsed/common";

export class ThemeCreateParams {

  @Required()
  @JsonProperty()
  public userId!: string;

  @Required()
  @JsonProperty()
  @MinLength(5)
  public title!: string;
}
