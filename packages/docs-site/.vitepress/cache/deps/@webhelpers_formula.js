import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __publicField
} from "./chunk-RGIOIEUU.js";

// ../formula/dist/src/lib/shared/fields.mjs
function o(e) {
  const r = e.querySelectorAll("*[name]:not([data-in-group])");
  return Array.from(r).filter((t2) => t2.checkValidity);
}
function n(e) {
  const r = e.querySelectorAll("*[name]");
  return Array.from(r).filter((t2) => t2.checkValidity);
}

// ../formula/dist/src/lib/form/errors.mjs
function f(i2, e) {
  const s4 = {};
  for (const t2 in i2.validity)
    t2 !== "valid" && i2.validity[t2] && (s4[t2] = i2.validity[t2]);
  return { ...s4, ...e };
}
function l(i2, e = {}) {
  const s4 = {}, t2 = {};
  return Object.entries(e).forEach(([r, o4]) => {
    const n5 = o4(i2);
    n5 !== null && (s4[r] = n5, t2[r] = true);
  }), [s4, t2];
}
function v(i2, e, s4) {
  return (t2, r) => {
    var _a, _b;
    if (e.forEach(
      /**
       *
       * @param {HTMLElement[]} groupEl
       */
      (a2) => {
        a2.setCustomValidity(""), a2.removeAttribute("data-formula-invalid");
      }
    ), !s4) {
      const a2 = t2.checkValidity();
      return a2 || t2.setAttribute("data-formula-invalid", "true"), {
        valid: a2,
        invalid: !a2,
        message: t2.validationMessage,
        errors: f(t2)
      };
    }
    const o4 = {
      ...(_a = s4 == null ? void 0 : s4.messages) == null ? void 0 : _a[i2],
      ...t2.dataset
    }, [n5, m] = l(r, (_b = s4 == null ? void 0 : s4.validators) == null ? void 0 : _b[i2]), u4 = f(t2, m), c2 = Object.keys(u4);
    t2.checkValidity() ? c2.length > 0 && t2.setCustomValidity(n5[c2[0]]) : o4[c2[0]] && t2.setCustomValidity(o4[c2[0]]);
    const d = t2.checkValidity();
    return d || t2.setAttribute("data-formula-invalid", "true"), {
      valid: d,
      invalid: !d,
      message: t2.validationMessage,
      errors: u4
    };
  };
}

// ../formula/dist/src/lib/form/aria.mjs
function i(t2) {
  var _a, _b;
  if (!t2 || !t2.parentElement)
    return;
  const e = t2.parentElement, r = e.querySelectorAll(":scope input[type=radio]").length > 1, a2 = ((_a = e.dataset) == null ? void 0 : _a.beakerGroup) || ((_b = e.dataset) == null ? void 0 : _b.formulaForm);
  return r && !a2 ? e : i(e);
}
function o2(t2, e) {
  var _a;
  if (t2.hasAttribute("aria-role"))
    return;
  const r = (a2) => t2.setAttribute("aria-role", a2);
  if (t2.type === "radio") {
    if (e.length < 2)
      (_a = t2 == null ? void 0 : t2.parentElement) == null ? void 0 : _a.setAttribute("aria-role", "radiogroup");
    else {
      const a2 = i(t2);
      a2 && a2.setAttribute("aria-role", "radiogroup");
    }
    r("radio");
  } else
    r(
      function() {
        switch (t2.type) {
          case "select-one":
          case "select-multiple":
          case "checkbox":
            return t2.type;
          case "file":
            return "file-upload";
          case "textarea":
            return "textbox";
          default:
            return `input-${t2.type}`;
        }
      }()
    );
}
function u(t2) {
  t2.hasAttribute("required") && t2.setAttribute("aria-required", "true");
}
function n2(t2, e) {
  t2.type === "radio" ? (e.forEach((r) => r.removeAttribute("aria-checked")), t2.setAttribute("aria-checked", t2.checked ? "true" : "false")) : t2.type === "checkbox" && t2.setAttribute("aria-checked", t2.checked ? "true" : "false");
}
function s(t2, e) {
  t2.hasAttribute("aria-role") || t2.setAttribute("aria-role", e ? "row" : "form");
}
function c(t2) {
  Array.from(t2.querySelectorAll("button:not([aria-role])")).forEach((r) => r.setAttribute("aria-role", "button"));
}

// ../formula/dist/src/lib/form/extract.mjs
function V(a2) {
  const l2 = [];
  for (let i2 = 0; i2 < a2.length; i2++)
    a2[i2].selected && l2.push(a2[i2].value);
  return l2;
}
function b(a2, l2, i2, s4) {
  i2 ? s4.forEach((f2, c2) => {
    f2.type === "checkbox" ? f2.checked = l2.includes(f2.value) : f2.value = l2[c2];
  }) : a2 instanceof HTMLSelectElement ? [...a2 == null ? void 0 : a2.options].forEach((f2) => {
    f2.selected = l2.includes(f2.value);
  }) : a2.type === "checkbox" ? a2.checked = l2 : a2.type === "radio" ? s4.forEach((f2) => f2.checked = l2 === f2.value) : a2.type === "file" ? a2.files = l2 instanceof FileList ? l2 : null : a2.value = l2;
}
function v2(a2, l2, i2) {
  let s4;
  if (a2 instanceof HTMLSelectElement)
    s4 = a2.multiple ? V(a2.options) : a2.value || null;
  else
    switch (a2.type) {
      case "number":
      case "range":
        s4 = l2 ? i2.map((c2) => parseFloat(c2.value)).filter((c2) => !isNaN(c2)) : (() => {
          const c2 = parseFloat(a2.value);
          return isNaN(c2) ? null : c2;
        })();
        break;
      case "checkbox":
        s4 = l2 ? i2.filter((c2) => c2.checked).map((c2) => c2.value) : a2.checked;
        break;
      case "radio":
        const f2 = i2.find((c2) => c2.checked);
        s4 = f2 ? f2.value : null;
        break;
      case "file":
        s4 = a2.files;
        break;
      default:
        s4 = l2 ? i2.map((c2) => c2.value) : a2.value || null;
    }
  return s4;
}
function p(a2, l2, i2, s4) {
  const f2 = v(a2, l2, i2);
  let c2 = false;
  return l2[0].type !== "radio" && (c2 = !l2[0].multiple && l2.length > 1), ((d, t2, u4, o4) => {
    var _a, _b, _c, _d;
    let e;
    if (u4 && ((_a = d == null ? void 0 : d.defaultValues) == null ? void 0 : _a[a2]) ? e = c2 ? ((_b = d == null ? void 0 : d.defaultValues) == null ? void 0 : _b[a2]) || [] : ((_c = d == null ? void 0 : d.defaultValues) == null ? void 0 : _c[a2]) || "" : e = s4.formValues.get()[a2] ?? (c2 ? [] : ""), !o4) {
      const r = v2(t2, c2, l2);
      r === null && !u4 && e.length > 0 && (e = ""), r !== null && (e = u4 && c2 && (r == null ? void 0 : r.length) === 0 ? e : r);
    }
    return (u4 || o4) && b(t2, e, c2, l2), n2(t2, l2), ((_d = t2.dataset) == null ? void 0 : _d.formulaName) && (a2 = t2.dataset.formulaName), {
      name: a2,
      value: e,
      ...f2(t2, e)
    };
  }).bind(this, i2);
}

// ../formula/dist/src/lib/form/enrichment.mjs
function u2(r, n5) {
  return (t2) => Object.entries((n5 == null ? void 0 : n5.enrich[r]) ?? {}).reduce((e, [c2, i2]) => (e[c2] = i2(t2), e), {});
}

// ../formula/dist/src/lib/form/event.mjs
function g(r, e) {
  const a2 = e.formValues.get();
  e.formValidity.set({});
  const i2 = Object.entries(r), n5 = {};
  for (const [t2, l2] of i2) {
    const c2 = l2(a2);
    c2 !== null && (n5[t2] = c2);
  }
  Object.keys(n5).length > 0 && (e.formValidity.set(n5), e.formValid.set(false));
}
function v3(r, e, a2, i2, n5) {
  const { name: t2, value: l2, ...c2 } = r;
  if (e.formValues.set({ ...e.formValues.get(), [t2]: l2 }), i2.size) {
    const f2 = { ...e.formValues.get() };
    i2.forEach((u4, d) => f2[d] = u4.length > 1 ? u4.map((m) => m.value) : u4[0].value), e.formValues.set(f2);
  }
  e.errors.set({ ...e.errors.get(), [t2]: c2 }), e.formValid.set(Object.values(e.errors.get()).every((f2) => f2.valid)), (a2 == null ? void 0 : a2.formValidators) && g(a2.formValidators, e), n5 && e.enrichment.set({ ...e.enrichment.get(), [t2]: n5(l2) }), typeof (a2 == null ? void 0 : a2.postChanges) == "function" && a2.postChanges(e.formValues.get());
}
function s2(r, e, a2, i2, n5) {
  return (t2) => {
    const l2 = (t2 == null ? void 0 : t2.currentTarget) ?? (t2 == null ? void 0 : t2.target), c2 = r(l2);
    v3(c2, e, a2, i2, n5);
  };
}
function b2(r, e, a2, i2, n5, t2, l2) {
  var _a;
  const c2 = p(r, i2, t2, n5);
  let f2;
  ((_a = t2 == null ? void 0 : t2.enrich) == null ? void 0 : _a[r]) && (f2 = u2(r, t2));
  const u4 = s2(c2, n5, t2, l2, f2);
  return a2.addEventListener(e, (d) => {
    typeof (t2 == null ? void 0 : t2.preChanges) == "function" && t2.preChanges(), u4(d);
  }), () => a2.removeEventListener(e, u4);
}
function E(r, e) {
  return () => {
    e.noValidate || e.reportValidity(), r.formValues.subscribe(
      /**
       * @param {any} v
       */
      (a2) => r.submitValues.set(a2)
    )();
  };
}

// ../formula/dist/src/lib/form/init.mjs
function y(f2, u4, e, n5) {
  var _a;
  const a2 = {}, r = {}, i2 = {};
  for (const [t2, c2] of u4) {
    const m = p(t2, c2, n5, e), { name: l2, value: s4, ...o4 } = m(c2[0], true);
    if (a2[l2] = s4, r[l2] = o4, (_a = n5 == null ? void 0 : n5.enrich) == null ? void 0 : _a[l2]) {
      const V2 = u2(l2, n5);
      i2[l2] = V2(s4);
    }
  }
  return e.formValues.set({ ...a2 }), e.initialValues.set({ ...a2 }), e.errors.set({ ...r }), e.formValid.set(Object.values({ ...r }).every((t2) => t2.valid)), e.enrichment.set({ ...i2 }), [a2, r, i2];
}
function b3(f2, u4, e, n5) {
  const [a2, r, i2] = y(f2, u4, e, n5);
  return () => {
    e.formValues.set(a2), e.errors.set(r), e.formValid.set(Object.values(r).every((t2) => t2.valid)), e.enrichment.set(i2), e.touched.set(Object.keys(a2).reduce((t2, c2) => ({ ...t2, [c2]: false }), {})), e.dirty.set(Object.keys(a2).reduce((t2, c2) => ({ ...t2, [c2]: false }), {}));
    for (const [t2, c2] of u4)
      p(t2, c2, n5, e)(c2[0], false, true);
  };
}

// ../formula/dist/src/lib/form/touch.mjs
function a(r, u4, t2) {
  const o4 = /* @__PURE__ */ new Map(), c2 = () => {
    for (const [e, n5] of o4)
      e.setAttribute("data-formula-touched", "true"), e.removeEventListener("focus", n5);
    o4.clear();
  };
  t2.touched.set({ ...t2.touched.get(), [r]: false });
  const d = () => () => {
    t2.touched.set({ ...t2.touched.get(), [r]: true }), c2();
  };
  for (const e of u4) {
    const n5 = d();
    e.addEventListener("focus", n5), o4.set(e, n5);
  }
  return c2;
}

// ../formula/dist/src/lib/form/dirty.mjs
var o3 = (n5, r) => n5.length === r.length && n5.every((e) => r.includes(e));
function b4(n5, r, e) {
  const l2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Map();
  let s4;
  const a2 = () => {
    for (const [t2, i2] of l2)
      t2.setAttribute("data-formula-dirty", "true"), t2.removeEventListener("blur", i2);
    l2.clear(), s4 && (s4(), s4 = void 0);
  };
  e.dirty.set({ ...e.dirty.get(), [n5]: false }), e.formValues.subscribe((t2) => c2.set(n5, t2[n5]))(), s4 = null;
  function d(t2) {
    return () => {
      const i2 = c2.get(t2), u4 = e.formValues.get();
      (Array.isArray(u4[t2]) ? !o3(u4[t2], i2) : u4[t2] !== i2) && (e.dirty.set({ ...e.dirty.get(), [t2]: true }), a2());
    };
  }
  for (const t2 of r) {
    const i2 = d(n5);
    t2.addEventListener("blur", i2), l2.set(t2, i2);
  }
  return a2;
}

// ../../node_modules/nanostores/clean-stores/index.js
var clean = Symbol("clean");

// ../../node_modules/nanostores/atom/index.js
var listenerQueue = [];
var lqIndex = 0;
var QUEUE_ITEMS_PER_LISTENER = 4;
var epoch = 0;
var atom = (initialValue) => {
  let listeners = [];
  let $atom = {
    get() {
      if (!$atom.lc) {
        $atom.listen(() => {
        })();
      }
      return $atom.value;
    },
    lc: 0,
    listen(listener) {
      $atom.lc = listeners.push(listener);
      return () => {
        for (let i2 = lqIndex + QUEUE_ITEMS_PER_LISTENER; i2 < listenerQueue.length; ) {
          if (listenerQueue[i2] === listener) {
            listenerQueue.splice(i2, QUEUE_ITEMS_PER_LISTENER);
          } else {
            i2 += QUEUE_ITEMS_PER_LISTENER;
          }
        }
        let index = listeners.indexOf(listener);
        if (~index) {
          listeners.splice(index, 1);
          if (!--$atom.lc) $atom.off();
        }
      };
    },
    notify(oldValue, changedKey) {
      epoch++;
      let runListenerQueue = !listenerQueue.length;
      for (let listener of listeners) {
        listenerQueue.push(listener, $atom.value, oldValue, changedKey);
      }
      if (runListenerQueue) {
        for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) {
          listenerQueue[lqIndex](
            listenerQueue[lqIndex + 1],
            listenerQueue[lqIndex + 2],
            listenerQueue[lqIndex + 3]
          );
        }
        listenerQueue.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {
    },
    set(newValue) {
      let oldValue = $atom.value;
      if (oldValue !== newValue) {
        $atom.value = newValue;
        $atom.notify(oldValue);
      }
    },
    subscribe(listener) {
      let unbind = $atom.listen(listener);
      listener($atom.value);
      return unbind;
    },
    value: initialValue
  };
  if (true) {
    $atom[clean] = () => {
      listeners = [];
      $atom.lc = 0;
      $atom.off();
    };
  }
  return $atom;
};

// ../../node_modules/nanostores/map/index.js
var map = (initial = {}) => {
  let $map = atom(initial);
  $map.setKey = function(key, value) {
    let oldMap = $map.value;
    if (typeof value === "undefined" && key in $map.value) {
      $map.value = { ...$map.value };
      delete $map.value[key];
      $map.notify(oldMap, key);
    } else if ($map.value[key] !== value) {
      $map.value = {
        ...$map.value,
        [key]: value
      };
      $map.notify(oldMap, key);
    }
  };
  return $map;
};

// ../formula/dist/src/lib/shared/stores.mjs
function S(t2, l2, i2) {
  return t2.reduce((n5, s4) => ({ ...n5, [s4]: i2(s4, l2) }), {});
}
function F(t2, l2) {
  const i2 = { ...t2 == null ? void 0 : t2.defaultValues, ...l2 }, n5 = Object.keys(i2), s4 = S(n5, i2, () => false), r = S(n5, i2, () => ({
    valid: true,
    invalid: false,
    message: "",
    errors: {}
  })), o4 = S(Object.keys((t2 == null ? void 0 : t2.formValidators) || {}), i2, () => ""), d = Object.entries((t2 == null ? void 0 : t2.enrich) || {}).reduce((V2, [u4, m]) => ({
    ...V2,
    [u4]: Object.entries(m).reduce(
      (c2, [f2, y2]) => {
        var _a, _b;
        return {
          ...c2,
          [f2]: ((_a = t2 == null ? void 0 : t2.defaultValues) == null ? void 0 : _a[u4]) ? y2((_b = t2 == null ? void 0 : t2.defaultValues) == null ? void 0 : _b[u4]) : void 0
        };
      },
      {}
    )
  }), {});
  return {
    initialValues: i2,
    initialKeys: n5,
    initialFieldState: s4,
    initialValidity: r,
    initialFormValidity: o4,
    initialEnrichment: d
  };
}
function b5(t2, l2) {
  const i2 = F(t2, l2);
  return {
    formValues: map(i2.initialValues),
    submitValues: map({}),
    initialValues: map(i2.initialValues),
    touched: map(i2.initialFieldState),
    dirty: map(i2.initialFieldState),
    errors: map(i2.initialValidity),
    formValidity: map(i2.initialFormValidity),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: map(i2.initialEnrichment)
  };
}
function O(t2) {
  const l2 = (t2 == null ? void 0 : t2.defaultValues) || [], { defaultValues: i2, ...n5 } = t2, s4 = l2.map((c2) => F({ ...n5, defaultValues: c2 })), r = (c2) => s4.reduce((f2, y2) => [...f2, y2[c2]], []), o4 = r("initialValues"), d = r("initialFieldState"), V2 = r("initialValidity"), u4 = r("initialEnrichment"), m = r("initialFormValidity");
  return {
    formValues: atom(o4),
    submitValues: atom([]),
    initialValues: atom(o4),
    touched: atom(d),
    dirty: atom(d),
    errors: atom(V2),
    formValidity: atom(m),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: atom(u4)
  };
}

// ../formula/dist/src/lib/form/form.mjs
function K(g2, d, v4, R) {
  const f2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Map(), n5 = /* @__PURE__ */ new Set(), u4 = /* @__PURE__ */ new Set(), e = b5(g2, R), h = typeof v4 < "u", b6 = g2;
  let E2, C = () => {
  }, m = [];
  function H(t2, s4 = {}) {
    (s4 == null ? void 0 : s4.preChanges) || (s4.preChanges = () => {
      var _a;
      (_a = t2 == null ? void 0 : t2.parentElement) == null ? void 0 : _a.dispatchEvent(new CustomEvent("form:preChanges", { detail: void 0 }));
    }), (s4 == null ? void 0 : s4.postChanges) || (s4.postChanges = (i2) => {
      var _a;
      (_a = t2 == null ? void 0 : t2.parentElement) == null ? void 0 : _a.dispatchEvent(new CustomEvent("form:postChanges", { detail: i2 }));
    });
    const M2 = h ? n(t2) : o(t2);
    t2.setAttribute(`data-formula-${h ? "row" : "form"}`, "true"), s(t2, h), c(t2), m = [
      ...M2.reduce((i2, a2) => {
        const p3 = a2.dataset.formulaName || a2.getAttribute("name");
        return i2.set(p3, [...i2.get(p3) || [], a2]);
      }, /* @__PURE__ */ new Map())
    ], C = b3(t2, m, e, s4), m.forEach(([i2, a2]) => {
      if (a2[0].type === "hidden") {
        c2.set(i2, a2);
        return;
      }
      n5.add(a(i2, a2, e)), u4.add(b4(i2, a2, e)), a2.forEach((r) => {
        h && r.setAttribute("data-in-group", v4), o2(r, a2), u(r);
        const p3 = r.dataset.formulaBind;
        p3 ? p3.split("|").forEach((w) => f2.set(r, b2(i2, w, r, a2, e, s4, c2))) : r instanceof HTMLSelectElement ? f2.set(r, b2(i2, "change", r, a2, e, s4, c2)) : (["radio", "checkbox", "file", "range", "color", "date", "time", "week", "number"].includes(r.type) && f2.set(r, b2(i2, "change", r, a2, e, s4, c2)), r.type !== "hidden" && f2.set(r, b2(i2, "keyup", r, a2, e, s4, c2)));
      });
    }), t2.id && d && d.set(t2.id, e), t2 instanceof HTMLFormElement && (E2 = E(e, t2), t2.addEventListener("submit", E2)), e.formReady.set(true);
  }
  let o4;
  function l2() {
    [...f2].forEach(([t2, s4]) => {
      t2.setCustomValidity(""), s4();
    }), [...n5, ...u4].forEach((t2) => t2()), [f2, n5, u4].forEach((t2) => t2.clear()), E2 && o4.removeEventListener("submit", E2);
  }
  return {
    init: (t2) => (o4 = t2, H(t2, g2), {
      root: t2,
      elements: m,
      destroy: () => {
        e.formReady.set(false), l2(), o4.id && d && d.delete(o4.id);
      }
    }),
    updateForm: (t2) => {
      e.formReady.set(false), l2(), H(o4, t2 || b6);
    },
    destroyForm: () => {
      e.formReady.set(false), l2(), o4.id && d && d.delete(o4.id);
    },
    resetForm: () => {
      C(), [...n5, ...u4].forEach((t2) => t2()), m.forEach(([t2, s4]) => {
        n5.add(a(t2, s4, e)), u4.add(b4(t2, s4, e));
      });
    },
    stores: e,
    ...e
  };
}

// ../formula/dist/src/lib/group/group.mjs
var j = 0;
function M(y2, l2) {
  const r = O(y2);
  let a2, c2;
  const { defaultValues: A = [], ...V2 } = y2 || {}, i2 = /* @__PURE__ */ new Map(), f2 = /* @__PURE__ */ new Map(), p3 = /* @__PURE__ */ new Set();
  function m() {
    f2.forEach((e) => e.destroy()), p3.forEach((e) => e()), f2.clear(), i2.clear(), p3.clear();
  }
  function h(e) {
    for (const s4 of Object.keys(r)) {
      if (["formValues", "initialValues", "submitValues"].includes(s4)) continue;
      const t2 = r[s4].get();
      r[s4].set(Array.isArray(t2) ? t2.slice(0, e.length) : t2);
    }
  }
  function S2(e, s4) {
    const t2 = Object.entries(e.stores);
    for (const [o4, n5] of t2) {
      let u4 = true;
      const O2 = n5.subscribe((k) => {
        if (u4 && o4 === "formValues") {
          u4 = false;
          return;
        }
        u4 = false;
        const d = r[o4].get();
        if (Array.isArray(d)) {
          const g2 = [...d];
          g2.splice(s4, 1, k), r[o4].set(g2);
        } else
          r[o4].set(d);
      });
      p3.add(O2);
    }
  }
  function b6(e) {
    r.formReady.set(false);
    const s4 = r.formValues.get();
    m(), h(e);
    for (let t2 = 0; t2 < e.length; t2++) {
      const o4 = e[t2];
      o4.setAttribute("data-beaker-index", `${t2}`);
      const n5 = K(
        {
          ...V2,
          defaultValues: (A == null ? void 0 : A[t2]) || {}
        },
        void 0,
        a2,
        s4[t2]
      ), u4 = n5.init(o4);
      i2.set(o4, n5), f2.set(o4, u4), S2(n5, t2);
    }
    r.formReady.set(true);
  }
  function w(e) {
    c2 = new MutationObserver(() => {
      const t2 = e.querySelectorAll(":scope > *");
      b6(Array.from(t2));
    }), c2.observe(e, { childList: true });
    const s4 = e.querySelectorAll(":scope > *");
    b6(Array.from(s4));
  }
  return {
    group: (e) => (e.id ? (a2 = e.id, l2.set(a2, r)) : (a2 = `beaker-group-${j++}`, e.id = a2), e.setAttribute("data-beaker-group", "true"), e.hasAttribute("aria-role") || e.setAttribute("aria-role", "group"), w(e), {
      destroy: () => {
        a2 && l2.delete(a2), m(), c2.disconnect();
      }
    }),
    update: (e) => {
      i2.forEach((s4, t2) => t2.updateForm(e));
    },
    destroy: () => {
      a2 && l2.delete(a2), m(), c2.disconnect();
    },
    forms: i2,
    stores: r,
    init: (e) => r.formValues.set(e),
    add: (e) => r.formValues.set([...r.formValues.get(), e]),
    set: (e, s4) => {
      const t2 = [...r.formValues.get()];
      t2.splice(e, 1, s4), r.formValues.set(t2);
    },
    /**
     *
     * @param {number} index
     * @returns
     */
    delete: (e) => Object.keys(r).forEach((s4) => {
      const t2 = r[s4].get();
      if (Array.isArray(t2)) {
        const o4 = [...t2];
        o4.splice(e, 1), r[s4].set(o4);
      }
    }),
    clear: () => r.formValues.set([]),
    ...r
  };
}

// ../formula/dist/src/lib/webcomponent/lib.mjs
function s3(o4) {
  const t2 = /* @__PURE__ */ new Map();
  for (const n5 in o4) {
    const e = n5.replace(/([A-Z])/g, " $1").trim().split(" ").map((r) => r.toLowerCase());
    e.length === 1 && e.unshift("form"), t2.set(n5, e.join(":"));
  }
  return t2;
}

// ../formula/dist/webcomponent.mjs
var _t, _n_instances, s_fn, i_fn, o_fn, e_fn;
var n3 = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _n_instances);
    /**
     * @type {boolean} If Formula should handle the form submission
     * @attr {boolean} handle-submit
     */
    __publicField(this, "handleSubmit", true);
    /**
     * @type {string | undefined} The root selector to use to find the form element
     * @attr {string | undefined} root-selector
     */
    __publicField(this, "rootSelector");
    /**
     * @type {string | undefined} The root selector to use to find the form element
     * @attr {string} formula-options
     */
    __publicField(this, "formulaOptions");
    /**
     * @type {Array<() => void>} Store subscriptions for cleanup
     * @private
     */
    __privateAdd(this, _t, []);
  }
  connectedCallback() {
    window.requestAnimationFrame(() => __privateMethod(this, _n_instances, o_fn).call(this));
  }
  disconnectedCallback() {
    this.handleSubmit && this.formEl.removeEventListener("submit", __privateMethod(this, _n_instances, e_fn)), __privateGet(this, _t).forEach((t2) => t2()), __privateSet(this, _t, []), this.form.destroy();
  }
};
_t = new WeakMap();
_n_instances = new WeakSet();
/**
 * Get the options from the data-* attributes
 * @private
 */
s_fn = function() {
  this.options = this.hasAttribute("formula-options") ? JSON.parse(this.getAttribute("formula-options")) : void 0, this.rootSelector = this.getAttribute("root-selector") ?? void 0;
};
/**
 * Get the passed data-root-selector or first child element and initialise the formula instance
 */
i_fn = function() {
  this.formEl = this.rootSelector ? (document ?? this).querySelector(this.rootSelector) : this.firstElementChild, this.getAttribute("handle-submit") === "true" && this.formEl.addEventListener("submit", __privateMethod(this, _n_instances, e_fn).bind(this));
};
o_fn = function() {
  __privateMethod(this, _n_instances, s_fn).call(this), __privateMethod(this, _n_instances, i_fn).call(this), this.formula = K(this.options), this.eventNames = s3(this.formula.stores), this.dispatchEvent(new CustomEvent("form:init", { bubbles: true, detail: this.formula })), this.form = this.formula.init(this.formEl), this.dispatchEvent(new CustomEvent("form:connect", { bubbles: true, detail: this.form })), Object.entries(this.formula.stores).forEach(([t2, e]) => {
    const s4 = e.subscribe(
      (i2) => this.dispatchEvent(
        new CustomEvent(this.eventNames.get(t2), {
          bubbles: true,
          detail: i2
        })
      )
    );
    __privateGet(this, _t).push(s4);
  });
};
/**
 * Handle form submission
 * @private
 * @param {Event} e - The submit event
 * @returns {void}
 **/
e_fn = function(t2) {
  t2.preventDefault(), t2.stopPropagation(), this.dispatchEvent(
    new CustomEvent("form:submit", {
      bubbles: true,
      detail: this.formula.stores.formValues.get()
    })
  );
};
customElements.define("formula-form", n3);

// ../formula/dist/index.mjs
var t = /* @__PURE__ */ new Map();
var n4 = /* @__PURE__ */ new Map();
function p2(r) {
  return K(r, t);
}
function u3(r) {
  return M(r, n4);
}
export {
  n3 as FormulaWebComponent,
  u3 as beaker,
  n4 as beakerStores,
  p2 as formula,
  t as formulaStores
};
//# sourceMappingURL=@webhelpers_formula.js.map
