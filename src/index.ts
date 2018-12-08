import { Server } from "./server";

const server = new Server();
server.start()
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
  });
