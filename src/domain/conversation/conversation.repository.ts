import { Conversation } from "./conversation";

export interface ConversationRepository {
  getByDroidIdAndDate(droidId: string, date: Date): Promise<Conversation[]>;
  getUnfinishedByDroidId(droidId: string): Promise<Conversation>;
  save(conversation: Conversation): Promise<void>;
}
