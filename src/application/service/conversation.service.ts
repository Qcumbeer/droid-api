import { Conversation } from "../../domain/conversation/conversation";
import { Dependencies } from "../core/dependencies";

export interface ConversationService {
  getOrCreateConversation(droidId: string): Promise<Conversation>;
}

export const conversationService = ({ conversationRepository, logger }: Dependencies): ConversationService => ({
  async getOrCreateConversation(droidId: string) {
    try {
      return await conversationRepository.getUnfinishedByDroidId(droidId);
    } catch (e) {
      const conversation = Conversation.create({ droidId }) as Conversation;

      logger.info("New conversation has been created", { id: conversation.toJSON().id });

      return conversation;
    }
  }
});
