import { NotFoundError } from "../../domain/core/validator";
import { Question } from "../../domain/question/question";
import { QuestionRepository } from "../../domain/question/question.repository";

export const questionRepository = (questions: Question[]): QuestionRepository => {
  const data = new Map<string, Question>(questions.map(question => [question.toJSON().id, question]));

  return {
    async getById(id: string) {
      const foundQuestion = [...data.values()].find(question => question.toJSON().id === id);

      if (!foundQuestion) {
        throw new NotFoundError(`Question with id ${id} could not be found.`);
      }

      return foundQuestion;
    },
    async getInitial() {
      const foundQuestion = [...data.values()].find(question => question.toJSON().initial);

      if (!foundQuestion) {
        throw new NotFoundError(`Initial question could not be found.`);
      }

      return foundQuestion;
    }
  };
};
