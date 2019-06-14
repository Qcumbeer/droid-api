import { NotFoundError } from "../../domain/core/validator";
import { Droid } from "../../domain/droid/droid";
import { DroidRepository } from "../../domain/droid/droid.repository";

export const droidRepository = (): DroidRepository => {
  const data = new Map<string, Droid>();

  return {
    async getById(id: string) {
      const foundDroid = [...data.values()].find(droid => droid.toJSON().id === id);

      if (!foundDroid) {
        throw new NotFoundError(`Droid with id ${id} could not be found.`);
      }

      return foundDroid;
    },
    async save(droid: Droid) {
      data.set(droid.toJSON().id, droid);
    }
  };
};
