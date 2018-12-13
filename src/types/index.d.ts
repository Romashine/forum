declare namespace Express {
  // tslint:disable-next-line:interface-name
  export interface Request {
    user: {
      email: string;
      password: string;
    };
  }
}
