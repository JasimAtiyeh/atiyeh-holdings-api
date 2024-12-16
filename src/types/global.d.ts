import { Request } from "express";
import { global } from "webpack";
import User from "../models/user";

declare global {
  namespace Express {
    export interface Request {
      // user: User;
    }
  }
}
export { Request };
