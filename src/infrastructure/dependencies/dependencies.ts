import { Dependencies } from "../../application/core/dependencies";
import { Logger } from "../../application/logger/logger";
import { conversationService } from "../../application/service/conversation.service";
import { droidService } from "../../application/service/droid.service";
import { questionService } from "../../application/service/question.service";
import { questions } from "../questions/questions";
import { conversationRepository } from "../repositories/conversations.in-memory";
import { droidRepository } from "../repositories/droids.in-memory";
import { questionRepository } from "../repositories/questions.in-memory";

// TODO: change to awilix
export const dependencies = (logger: Logger): Dependencies => {
  const conversationRepo = conversationRepository();
  const droidRepo = droidRepository();
  const questionRepo = questionRepository(questions());

  return {
    logger,
    conversationRepository: conversationRepo,
    questionRepository: questionRepo,
    droidRepository: droidRepo,
    conversationService: conversationService({ conversationRepository: conversationRepo, logger } as Dependencies),
    droidService: droidService({ droidRepository: droidRepo, logger } as Dependencies),
    questionService: questionService({ questionRepository: questionRepo, logger } as Dependencies)
  };
};
