import { Email, JsonProperty, MinLength, Required } from "@tsed/common";

export class UserCreateParams {
  @Required()
  @Email()
  public email!: string;

  @Required()
  @JsonProperty()
  @MinLength(5)
  public username!: string;

  @Required()
  @JsonProperty()
  @MinLength(5)
  public password!: string;
}
