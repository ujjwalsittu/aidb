import request from "supertest";
import app from "../../app"; // or path to your Express instance
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

describe("health endpoint", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, { status: "ok" });
  });
});
