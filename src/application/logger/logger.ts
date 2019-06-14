type LeveledLogMethod = (message: string, ...meta: any[]) => Logger;

export interface Logger {
  error: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  debug: LeveledLogMethod;
}
