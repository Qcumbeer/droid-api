import { Droid } from "../../domain/droid/droid";
import { Dependencies } from "../core/dependencies";

export interface DroidService {
  getOrCreateDroid(id: string): Promise<Droid>;
  learnMath(droid: Droid): Promise<void>;
}

export const droidService = ({ droidRepository, logger }: Dependencies): DroidService => ({
  async getOrCreateDroid(id: string) {
    try {
      return await droidRepository.getById(id);
    } catch (e) {
      const droid = Droid.create({ id }) as Droid;
      await droidRepository.save(droid);

      logger.info("Created new droid", { id });

      return droid;
    }
  },
  async learnMath(droid: Droid) {
    droid.learnMath();
    droidRepository.save(droid);

    logger.info("Droid has learnt math", { id: droid.toJSON().id });
  }
});
