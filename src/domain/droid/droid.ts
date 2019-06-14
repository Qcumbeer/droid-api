import * as Joi from "@hapi/joi";
import { BaseModel } from "../core/base-model";

export class Droid extends BaseModel {
  protected static schema = Joi.object({
    id: Joi.string().required()
  }).required();

  private canMaths: boolean = false;

  public learnMath(): void {
    this.canMaths = true;
  }

  public toJSON() {
    return {
      id: this.id,
      canMaths: this.canMaths
    };
  }
}
