import { Conversation } from "../../domain/conversation/conversation";
import { ConversationRepository } from "../../domain/conversation/conversation.repository";
import { NotFoundError } from "../../domain/core/validator";

export const conversationRepository = (): ConversationRepository => {
  const data = new Map<string, Conversation>();

  return {
    async getByDroidIdAndDate(droidId: string, date: Date) {
      return [...data.values()].filter(
        conversation => conversation.toJSON().droidId === droidId && conversation.matchesDate(date)
      );
    },
    async getUnfinishedByDroidId(droidId: string) {
      const foundConversation = [...data.values()].find(conversation => {
        const conv = conversation.toJSON();
        return conv.finished === false && conv.droidId === droidId;
      });

      if (!foundConversation) {
        throw new NotFoundError(`Conversation with droidId ${droidId} could not be found.`);
      }

      return foundConversation;
    },
    async save(conversation: Conversation) {
      data.set(conversation.toJSON().id, conversation);
    }
  };
};
