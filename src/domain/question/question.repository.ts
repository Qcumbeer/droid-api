import { Question } from "./question";

export interface QuestionRepository {
  getInitial(): Promise<Question>;
  getById(id: string): Promise<Question>;
}
