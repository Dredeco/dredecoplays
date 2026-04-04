import { describe, expect, it } from "vitest";
import { shuffle } from "./utils";

describe("shuffle", () => {
  it("preserves length and is deterministic for same ids", () => {
    const a = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(shuffle(a)).toHaveLength(3);
    expect(shuffle(a).map((x) => x.id)).toEqual(shuffle(a).map((x) => x.id));
  });
});
