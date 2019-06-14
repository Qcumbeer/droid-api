import * as cors from "cors";
import * as express from "express";
import { messageCreate } from "../../application/actions/message-create.action";
import { messageList } from "../../application/actions/message-list.action";
import { Dependencies } from "../../application/core/dependencies";
import { errorMiddleware } from "./middleware/error.middleware";

export const server = (dependencies: Dependencies): express.Application => {
  const application = express();

  application.use(express.json());
  application.use(cors());

  application.post("/messages", messageCreate(dependencies));
  application.get("/messages", messageList(dependencies));

  application.use("*", (req: express.Request, res: express.Response) =>
    res.status(404).json({ message: "error.not-found" })
  );

  application.use(errorMiddleware);

  return application;
};
