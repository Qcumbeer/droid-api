import { Conversation } from "../../domain/conversation/conversation";
import { Question } from "../../domain/question/question";
import { Dependencies } from "../core/dependencies";

export interface QuestionService {
  findNextQuestion(conversation: Conversation, message: string | number): Promise<Question>;
}

export const questionService = ({ questionRepository }: Dependencies): QuestionService => ({
  async findNextQuestion(conversation: Conversation, message: string | number) {
    const lastMessage = conversation.getLastMessage();

    if (!lastMessage) {
      return questionRepository.getInitial();
    }

    if (lastMessage.isTerminal()) {
      throw new Error("It's a terminal question. There are no more.");
    }

    const lastMessageData = lastMessage.toJSON();

    const previousQuestion = await questionRepository.getById(lastMessageData.questionId);
    const nextQuestionId = previousQuestion.getNextQuestionId(message, lastMessageData.parameters);

    return await questionRepository.getById(nextQuestionId);
  }
});
