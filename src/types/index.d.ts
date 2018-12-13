declare namespace Express {
  // tslint:disable-next-line:interface-name
  export interface Request {
    user: {
      _id: string;
      id: string;
      email: string;
      password: string;
    };
  }
}
