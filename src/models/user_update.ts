import { JsonProperty, MinLength, Required } from "@tsed/common";

export class UserUpdateParams {

  @JsonProperty()
  @MinLength(5)
  public username?: string;

  @JsonProperty()
  @MinLength(5)
  public password?: string;
}
