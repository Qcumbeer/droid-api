import { Dependencies } from "./dependencies";

export interface Request {
  body?: any;
  query?: any;
}

export interface Response {
  json(body?: any): Response;
}

export type NextFunction = (err?: any) => void;

export type ActionHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type Action = (dependencies: Dependencies) => ActionHandler;
