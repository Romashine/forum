import "@tsed/ajv";
import { ServerLoader, ServerSettings } from "@tsed/common";
import "@tsed/swagger";
import config from "config";
import * as path from "path";
import { GlobalErrorHandlerMiddleware } from "./middlewares/middleware_error";

const rootDir = path.resolve(__dirname);

@ServerSettings({
  rootDir,
  mount: {
    "/v1": `${rootDir}/controllers/*.ts`,
  },
  componentsScan: [
    `${rootDir}/middlewares/*.ts`,
    `${rootDir}/services/*.ts`,
  ],
  swagger: [
    {
      path: "/api-docs",
    },
  ],

  ajv: {
    errorFormat: (error: any) => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
    options: { verbose: true },
  },
  acceptMimes: ["application/json"],
  httpPort: config.get("PORT"),
  httpsPort: false,
})

export class Server extends ServerLoader {
  public $afterRoutesInit() {
    this.use(GlobalErrorHandlerMiddleware);
  }
  public $onMountingMiddlewares(): void | Promise<any> {

    const bodyParser = require("body-parser");

    this
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true,
      }));
  }
}
