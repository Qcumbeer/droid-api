import { messageCreate } from "./message-create.action";
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
  let action: ActionHandler;
  let deps: Dependencies;
  let response: Response;
  let nextFunction: NextFunction;

  beforeEach(() => {
    deps = dependencies(loggerMock());
    action = messageCreate(deps);
    response = responseMock();
    nextFunction = nextFunctionMock();
  });

  it("Initializes new conversation", async () => {
    const message = "hello";
    const droidId = "droid-id";

    await action({ body: { message, droidId } }, response, nextFunction);

    expect(response.json).toBeCalled();

    const conversation = await deps.conversationRepository.getUnfinishedByDroidId(droidId);
    const conversationJSON = conversation.toJSON();
    expect(conversationJSON.droidId).toBe(droidId);
    expect(conversationJSON.messages.length).toBe(1);
    expect(typeof conversationJSON.messages[0].id).toBe("string");
    expect(conversationJSON.messages[0].questionText).toBe(message);
  });

  it("Cannot start conversation without hello message", async () => {
    const message = "not-hello";
    const droidId = "droid-id";

    await action({ body: { message, droidId } }, response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect(response.json).not.toBeCalled();
  });

  it("Proves it can maths", async () => {
    const message = "hello";
    const droidId = "droid-id";

    await action({ body: { message, droidId } }, response, nextFunction);
    await action({ body: { message: "yes", droidId } }, response, nextFunction);
    await action({ body: { message: 17, droidId } }, response, nextFunction);
    await action({ body: { message: "yes", droidId } }, response, nextFunction);
    await action({ body: { message: 30, droidId } }, response, nextFunction);

    const conversations = await deps.conversationRepository.getByDroidIdAndDate(droidId, new Date());
    expect(conversations.length).toBe(1);
    expect(conversations[0].toJSON().finished).toBeTruthy();

    const droid = await deps.droidRepository.getById(droidId);
    expect(droid.toJSON().canMaths).toBeTruthy();
  });

  it("Doesn't want to prove maths", async () => {
    const message = "hello";
    const droidId = "droid-id";

    await action({ body: { message, droidId } }, response, nextFunction);
    await action({ body: { message: "no", droidId } }, response, nextFunction);

    const conversations = await deps.conversationRepository.getByDroidIdAndDate(droidId, new Date());
    expect(conversations.length).toBe(1);
    expect(conversations[0].toJSON().finished).toBeTruthy();

    const droid = await deps.droidRepository.getById(droidId);
    expect(droid.toJSON().canMaths).toBeFalsy();
  });

  it("Fails at last question", async () => {
    const message = "hello";
    const droidId = "droid-id";

    await action({ body: { message, droidId } }, response, nextFunction);
    await action({ body: { message: "yes", droidId } }, response, nextFunction);
    await action({ body: { message: 17, droidId } }, response, nextFunction);
    await action({ body: { message: "yes", droidId } }, response, nextFunction);
    await action({ body: { message: 20, droidId } }, response, nextFunction);

    const conversations = await deps.conversationRepository.getByDroidIdAndDate(droidId, new Date());
    expect(conversations.length).toBe(1);
    expect(conversations[0].toJSON().finished).toBeTruthy();

    const droid = await deps.droidRepository.getById(droidId);
    expect(droid.toJSON().canMaths).toBeFalsy();
  });

  it("Validates missing message", async () => {
    await action({ body: {} }, response, nextFunction);
    expect(nextFunction).toBeCalled();
  });
});
