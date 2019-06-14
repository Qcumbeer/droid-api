import { BaseModel } from "../core/base-model";
import { Droid } from "./droid";

export interface DroidRepository {
  save(conversation: BaseModel): Promise<void>;
  getById(id: string): Promise<Droid>;
}
