import { ConversationRepository } from "../../domain/conversation/conversation.repository";
import { DroidRepository } from "../../domain/droid/droid.repository";
import { QuestionRepository } from "../../domain/question/question.repository";
import { Logger } from "../logger/logger";
import { ConversationService } from "../service/conversation.service";
import { DroidService } from "../service/droid.service";
import { QuestionService } from "../service/question.service";

export interface Dependencies {
  logger: Logger;
  conversationRepository: ConversationRepository;
  questionRepository: QuestionRepository;
  droidRepository: DroidRepository;
  conversationService: ConversationService;
  droidService: DroidService;
  questionService: QuestionService;
}
