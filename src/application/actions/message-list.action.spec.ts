import { messageCreate } from "./message-create.action";
import { messageList } from "./message-list.action";
import { Dependencies } from "../core/dependencies";
import { Response, ActionHandler, NextFunction } from "../core/action";
import { dependencies } from "../../infrastructure/dependencies/dependencies";
import { Logger } from "../logger/logger";

jest.mock("../../domain/question/numbers-generator", () => ({
  generateNumbers: () => [10, 20]
}));

const responseMock = (): Response => ({
  json: jest.fn()
});

const nextFunctionMock = (): NextFunction => jest.fn();

const loggerMock = (): Logger => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
});

describe("Message create action", () => {
  let createAction: ActionHandler;
  let listAction: ActionHandler;
  let deps: Dependencies;
  let response: Response;
  let nextFunction: NextFunction;

  beforeEach(() => {
    deps = dependencies(loggerMock());
    createAction = messageCreate(deps);
    listAction = messageList(deps);
    response = responseMock();
    nextFunction = nextFunctionMock();
  });

  it("Gets conversation", async () => {
    const message = "hello";

    await createAction({ body: { message, droidId: "droid-1" } }, responseMock(), nextFunction);
    await createAction({ body: { message, droidId: "droid-2" } }, responseMock(), nextFunction);

    await listAction({ query: { droidId: "droid-1", date: new Date().getTime() } }, response, nextFunction);
    expect(response.json).toBeCalled();
  });

  it("Throws error if droid not exists", async () => {
    await listAction({ query: { droidId: "droid-1", date: new Date().getTime() } }, response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect(response.json).not.toBeCalled();
  });
});
