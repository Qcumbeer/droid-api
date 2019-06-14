import * as Joi from "@hapi/joi";
import { validate } from "../../domain/core/validator";
import { Action, NextFunction, Request, Response } from "../core/action";
import { Dependencies } from "../core/dependencies";

const requestSchema = Joi.object({
  date: Joi.date().required(),
  droidId: Joi.string().required()
}).required();

export const messageList: Action = ({ conversationRepository, droidRepository }: Dependencies) => async (
  { query }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validate(query, requestSchema);

    const droid = await droidRepository.getById(query.droidId);

    const conversations = await conversationRepository.getByDroidIdAndDate(
      droid.toJSON().id,
      new Date(Number(query.date))
    );

    res.json(conversations);
  } catch (e) {
    next(e);
  }
};
