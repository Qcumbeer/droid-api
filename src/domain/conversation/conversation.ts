import * as Joi from "@hapi/joi";
import { BaseModel } from "../core/base-model";
import { ValidationError } from "../core/validator";
import { Message } from "./message";

export class Conversation extends BaseModel {
  protected static schema = Joi.object({
    droidId: Joi.string()
  }).required();

  private droidId: string;
  private date: Date = new Date();
  private messages: Message[] = [];
  private finished: boolean = false;

  public addMessage(message: Message) {
    if (!this.messages.length && !message.isHello()) {
      throw new ValidationError({ message: "custom.helloRequired" });
    }

    this.messages.push(message);

    if (message.isTerminal()) {
      this.finished = true;
    }
  }

  public isSuccessfullyFinished(): boolean {
    const lastMessage = this.getLastMessage();

    return this.finished && lastMessage !== undefined && lastMessage.isSuccessfull();
  }

  public getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1];
  }

  public matchesDate(date: Date): boolean {
    return (
      date.getFullYear() === this.date.getFullYear() &&
      date.getMonth() === this.date.getMonth() &&
      date.getDate() === this.date.getDate()
    );
  }

  public toJSON() {
    return {
      id: this.id,
      droidId: this.droidId,
      date: this.date.getTime(),
      messages: this.messages.map(message => message.toJSON()),
      finished: this.finished
    };
  }
}
