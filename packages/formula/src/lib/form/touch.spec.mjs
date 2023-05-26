import { map } from "nanostores";
import { createTouchHandlers } from "./touch.mjs";

describe("Formula Touch Handler", () => {
  const storeMock = {
    touched: map({}),
  };

  let element;
  let elements;
  let destroyHandler;

  beforeEach(() => {
    element = document.createElement("input");
    element.type = "text";
    element.setAttribute("name", "testing");
    elements = [element];

    document.body.appendChild(element);

    destroyHandler = createTouchHandlers("testing", elements, storeMock);
  });

  afterEach(() => {
    document.body.removeChild(element);
    destroyHandler();
  });

  it("should create the handler function", () => {
    expect(destroyHandler).toBeInstanceOf(Function);
  });

  it("should set the default value to false", () => {
    storeMock.touched.subscribe((v) => {
      expect(v).toStrictEqual({ testing: false });
    })();
  });

  it("should update the store on focus", () => {
    element.focus();
    storeMock.touched.subscribe((v) => {
      expect(v).toStrictEqual({ testing: true });
    })();
  });
});
