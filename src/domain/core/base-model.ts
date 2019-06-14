import { v4 as uuid } from "uuid";
import { JoiObject } from "@hapi/joi";
import { validate } from "./validator";

export interface ModelFactory {
  create: (data: any, id?: string) => BaseModel;
  repositoryClass: any;
}

export class BaseModel {
  public static repositoryClass: any;

  public static create(data: any, id = uuid()) {
    if (this.schema) {
      validate(data, this.schema);
    }

    return new this(id, data);
  }

  protected static schema?: JoiObject;

  protected constructor(protected id: string, data: any) {
    Object.assign(this, data);
  }

  public toJSON() {
    return {
      id: this.id
    };
  }
}
