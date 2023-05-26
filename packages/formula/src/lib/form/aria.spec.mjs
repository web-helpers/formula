import { setAriaRole, setAriaStates } from "./aria.mjs";

describe("Formula ARIA", () => {
  describe("Set Role", () => {
    /**
     * @type {HTMLDivElement}
     */
    let element;

    afterEach(() => {
      document.body.removeChild(element);
    });

    it("should set radio and radiogroup", () => {
      element = document.createElement("div");
      const group = [];
      for (let i = 0; i < 4; i++) {
        const input = document.createElement("input");
        input.id = `testing-${i}`;
        input.setAttribute("type", "radio");
        input.setAttribute("name", "testing");
        input.value = `${i}`;
        group.push(input);
        element.appendChild(input);
      }
      document.body.appendChild(element);
      setAriaRole(group[0], group);
      expect(group[0].getAttribute("aria-role")).toBe("radio");
      expect(element.getAttribute("aria-role")).toBe("radiogroup");
    });

    it("should set checkbox", () => {
      element = document.createElement("input");
      element.setAttribute("type", "checkbox");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("checkbox");
    });

    it("should set text", () => {
      element = document.createElement("input");
      element.setAttribute("type", "text");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("input-text");
    });

    it("should set select-one", () => {
      element = document.createElement("select");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("select-one");
    });

    it("should set select-multiple", () => {
      element = document.createElement("select");
      element.setAttribute("multiple", "multiple");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("select-multiple");
    });

    it("should set textarea", () => {
      element = document.createElement("textarea");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("textbox");
    });

    it("should set file", () => {
      element = document.createElement("input");
      element.setAttribute("type", "file");
      element.setAttribute("name", "testing");
      document.body.appendChild(element);
      setAriaRole(element, [element]);
      expect(element.getAttribute("aria-role")).toBe("file-upload");
    });
  });

  describe("Set State", () => {
    /**
     * @type {HTMLInputElement}
     */
    let element;

    afterEach(() => {
      document.body.removeChild(element);
    });

    it("should set required", () => {
      element = document.createElement("input");
      element.setAttribute("type", "text");
      element.setAttribute("name", "testing");
      element.setAttribute("required", "required");
      document.body.appendChild(element);
      setAriaStates(element);
      expect(element.getAttribute("aria-required")).toBe("true");
    });
  });
});
