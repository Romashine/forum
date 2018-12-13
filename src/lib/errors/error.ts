import { JsonProperty } from "@tsed/common";

export class HttpError extends Error {
  @JsonProperty()
  public status: number;
  @JsonProperty()
  public code: string;
  @JsonProperty()
  public source: IErrorSource;
  @JsonProperty()
  public meta?: object;

  /**
   * @param status
   * @param code
   * @param message
   * @param sourcePointer - JSON pointer [RFC6901]
   * @param sourceParameter - indicating which URI query parameter caused the error
   * @param meta - object containing specific information
   */
  // tslint:disable-next-line:max-line-length
  constructor(
    status: number,
    code: string,
    message: string,
    sourcePointer?: string,
    sourceParameter?: string,
    meta: object = {},
  ) {
    super(message);

    this.status = status;
    this.code = code;
    this.source = {
      pointer: sourcePointer,
      parameter: sourceParameter,
    };
    this.meta = meta;
  }

  /**
   * Возвращает JSON
   */
  public toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      source: this.source,
      meta: this.meta,
    };
  }

}

interface IErrorSource {
  pointer?: string;
  parameter?: string;
}
