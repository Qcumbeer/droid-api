import * as Joi from "@hapi/joi";
import { Message } from "../../domain/conversation/message";
import { validate, ValidationError } from "../../domain/core/validator";
import { Action, NextFunction, Request, Response } from "../core/action";
import { Dependencies } from "../core/dependencies";

const requestSchema = Joi.object({
  message: Joi.alternatives(Joi.string(), Joi.number()).required(),
  droidId: Joi.string().required()
}).required();

export const messageCreate: Action = ({
  conversationService,
  conversationRepository,
  droidService,
  questionService,
  logger
}: Dependencies) => async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    validate(body, requestSchema);

    const droid = await droidService.getOrCreateDroid(body.droidId);

    if (droid.toJSON().canMaths) {
      throw new ValidationError({ message: "custom.alreadyCanMaths" });
    }

    const conversation = await conversationService.getOrCreateConversation(body.droidId);
    const question = await questionService.findNextQuestion(conversation, body.message);

    const message = Message.create({
      questionText: body.message,
      question
    }) as Message;

    logger.info("Created new message", { id: message.toJSON().id });

    conversation.addMessage(message);

    if (conversation.isSuccessfullyFinished()) {
      droidService.learnMath(droid);
    }

    await conversationRepository.save(conversation);

    logger.info("Updated conversation", { id: conversation.toJSON().id });

    res.json({ message: message.toJSON().answerText });
  } catch (e) {
    next(e);
  }
};
