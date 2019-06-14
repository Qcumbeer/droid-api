import { application } from "./app";
import * as request from "supertest";

describe("HTTP Application", () => {
  it("Returns successfull message", async () => {
    const { body, status } = await request(application)
      .post("/messages")
      .send({ droidId: "droid-id", message: "hello" });

    expect(status).toBe(200);
    expect(typeof body.message).toBe("string");
    expect(body.message.length).toBeGreaterThan(0);
  });

  it("Returns validation message", async () => {
    const { body, status } = await request(application)
      .post("/messages")
      .send({ droidId: "droid-id" });

    expect(status).toBe(400);
    expect(body.errors).toEqual({ message: "any.required" });
  });

  it("Catches not existing path", async () => {
    const { body, status } = await request(application).get("/not-existing");

    expect(status).toBe(404);
    expect(body.message).toBe("error.not-found");
  });
});
