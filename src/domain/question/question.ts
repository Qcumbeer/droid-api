import * as Joi from "@hapi/joi";
import { ValidMessage } from "../conversation/message";
import { BaseModel } from "../core/base-model";
import { generateNumbers } from "./numbers-generator";

export enum QuestionType {
  BOOL = "bool",
  ADDITION = "addition",
  RANDOM_ADDITION = "randomAddition",
  FAILURE = "failure",
  SUCCESS = "success"
}

export class Question extends BaseModel {
  protected static terminalTypes = [QuestionType.FAILURE, QuestionType.SUCCESS];

  protected static schema = Joi.object({
    id: Joi.string().required(),
    question: Joi.string().required(),
    parameters: Joi.array()
      .items(Joi.number())
      .when("type", {
        is: QuestionType.ADDITION,
        then: Joi.array()
          .min(2)
          .required()
      }),
    correctAnswer: Joi.string()
      .required()
      .when("type", { is: Question.terminalTypes, then: Joi.allow(null) }),
    incorrectAnswer: Joi.string()
      .required()
      .when("type", { is: Question.terminalTypes, then: Joi.allow(null) }),
    type: Joi.string()
      .allow(Object.values(QuestionType))
      .required(),
    initial: Joi.boolean().optional()
  }).required();

  private question: string;
  private parameters?: number[];
  private correctAnswer: string | null;
  private incorrectAnswer: string | null;
  private type: QuestionType;
  private initial?: boolean;

  public getNextQuestionId(value: string | number, parameters?: number[]): string {
    if (this.isTerminalQuestion()) {
      throw new Error("This is terminal question. You can't get next question");
    }

    return this.isCorrect(value, parameters) ? this.correctAnswer! : this.incorrectAnswer!;
  }

  public getParameters(): number[] | undefined {
    if (this.type === QuestionType.RANDOM_ADDITION) {
      return generateNumbers();
    }

    return this.parameters;
  }

  public getFullText(parameters?: number[]): string {
    if (this.type !== QuestionType.RANDOM_ADDITION) {
      return this.question;
    }

    let text = this.question;
    const placeholders = text.match(/\{RANDOM_NUMBER\}/g);

    if (!parameters || parameters.length !== placeholders!.length) {
      throw new Error(`Parameters ${parameters} don\'t match the question "${this.question}"`);
    }

    placeholders!.forEach((placeholder, index) => {
      text = text.replace(placeholder, String(parameters[index]));
    });

    return text;
  }

  public isTerminalQuestion(): boolean {
    return Question.terminalTypes.includes(this.type);
  }

  public isSuccessfull() {
    return this.type === QuestionType.SUCCESS;
  }

  public toJSON() {
    return {
      id: this.id,
      question: this.question,
      parameters: this.parameters,
      correctAnswer: this.correctAnswer,
      incorrectAnswer: this.incorrectAnswer,
      type: this.type,
      initial: this.initial
    };
  }

  private isCorrect(value: string | number, parameters?: number[]): boolean {
    switch (this.type) {
      case QuestionType.BOOL:
        return value === ValidMessage.YES;
      case QuestionType.ADDITION:
      case QuestionType.RANDOM_ADDITION:
        return (this.parameters || parameters)!.reduce((a, b) => a + b) === value;
    }

    return true;
  }
}
