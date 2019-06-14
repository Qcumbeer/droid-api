import * as data from "../../../data/questions.json";
import { Question } from "../../domain/question/question";

export const questions = (): Question[] => {
  // TODO: handle validation error
  return data.map(element => Question.create(element) as Question);
};
