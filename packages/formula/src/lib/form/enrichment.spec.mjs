import { createEnrichField } from "./enrichment.mjs";

describe("Formula Enrichment", () => {
  let enrich;

  beforeEach(() => {
    enrich = createEnrichField("testing", {
      enrich: {
        testing: {
          getLength: (value) => value.length,
        },
      },
    });
  });

  it("should update the enrich store", () => {
    const result = enrich("hello");
    expect(result).toStrictEqual({ getLength: 5 });
  });
});
