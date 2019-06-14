import * as Joi from "@hapi/joi";
import { BaseModel } from "../core/base-model";
import { Question } from "../question/question";

export enum ValidMessage {
  HELLO = "hello",
  YES = "yes",
  NO = "no"
}

export class Message extends BaseModel {
  protected static schema = Joi.object({
    questionText: Joi.alternatives(
      Joi.string()
        .allow(Object.values(ValidMessage))
        .required(),
      Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
    ),
    question: Joi.any(),
    questionId: Joi.string().allow(null)
  }).required();

  private questionText: ValidMessage | number;
  private question: Question;
  private parameters?: number[];

  protected constructor(protected id: string, data: any) {
    super(id, data);

    this.parameters = data.question.getParameters();
  }

  public isHello(): boolean {
    return this.questionText === ValidMessage.HELLO;
  }

  public getAnswerText(): string {
    return this.question.getFullText(this.parameters);
  }

  public isTerminal(): boolean {
    return this.question.isTerminalQuestion();
  }

  public isSuccessfull(): boolean {
    return this.question.isSuccessfull();
  }

  public toJSON() {
    return {
      id: this.id,
      questionText: this.questionText,
      questionId: this.question.toJSON().id,
      answerText: this.getAnswerText(),
      parameters: this.parameters
    };
  }
}
