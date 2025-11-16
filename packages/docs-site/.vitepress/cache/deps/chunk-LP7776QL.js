import { __privateAdd, __privateGet, __privateMethod, __privateSet, __publicField } from './chunk-RGIOIEUU.js';

// ../formula/dist/src/lib/shared/fields.mjs
function r(e) {
  return 'checkValidity' in e && typeof e.checkValidity == 'function';
}
function n(e) {
  const t = e.querySelectorAll('*[name]:not([data-in-group])');
  return Array.from(t).filter(r);
}
function o(e) {
  const t = e.querySelectorAll('*[name]');
  return Array.from(t).filter(r);
}

// ../formula/dist/src/lib/form/errors.mjs
function l(s4, e) {
  const r2 = {};
  for (const i2 in s4.validity) i2 !== 'valid' && s4.validity[i2] && (r2[i2] = s4.validationMessage || i2);
  return { ...r2, ...e };
}
function v(s4, e, r2 = {}) {
  const i2 = {};
  return (
    Object.entries(r2).forEach(([t, n5]) => {
      const o4 = n5(s4, e);
      o4 !== null && (i2[t] = o4);
    }),
    i2
  );
}
function m(s4, e, r2, i2) {
  return (t, n5) => {
    var _a, _b;
    if (
      (e.forEach((a2) => {
        (a2.setCustomValidity(''), a2.removeAttribute('data-formula-invalid'));
      }),
      !i2)
    ) {
      const a2 = t.checkValidity();
      return (
        a2 || t.setAttribute('data-formula-invalid', 'true'),
        {
          valid: a2,
          invalid: !a2,
          message: t.validationMessage,
          errors: l(t),
        }
      );
    }
    const o4 = {
        ...((_a = i2 == null ? void 0 : i2.messages) == null ? void 0 : _a[s4]),
        ...t.dataset,
      },
      c2 = v(n5, r2, (_b = i2 == null ? void 0 : i2.validators) == null ? void 0 : _b[s4]),
      u3 = l(t, c2),
      f = Object.keys(u3);
    if (f.length > 0) {
      const a2 = f[0];
      o4[a2] ? t.setCustomValidity(o4[a2]) : c2[a2] && t.setCustomValidity(c2[a2]);
    }
    const d = t.checkValidity();
    return (
      d || t.setAttribute('data-formula-invalid', 'true'),
      {
        valid: d,
        invalid: !d,
        message: t.validationMessage,
        errors: u3,
      }
    );
  };
}

// ../formula/dist/src/lib/form/aria.mjs
function i(t) {
  var _a, _b;
  if (!t || !t.parentElement) return;
  const e = t.parentElement,
    r2 = e.querySelectorAll(':scope input[type=radio]').length > 1,
    a2 = ((_a = e.dataset) == null ? void 0 : _a.beakerGroup) || ((_b = e.dataset) == null ? void 0 : _b.formulaForm);
  return r2 && !a2 ? e : i(e);
}
function o2(t, e) {
  var _a;
  if (t.hasAttribute('aria-role')) return;
  const r2 = (a2) => t.setAttribute('aria-role', a2);
  if (t.type === 'radio') {
    if (e.length < 2) (_a = t == null ? void 0 : t.parentElement) == null ? void 0 : _a.setAttribute('aria-role', 'radiogroup');
    else {
      const a2 = i(t);
      a2 && a2.setAttribute('aria-role', 'radiogroup');
    }
    r2('radio');
  } else
    r2(
      (function () {
        switch (t.type) {
          case 'select-one':
          case 'select-multiple':
          case 'checkbox':
            return t.type;
          case 'file':
            return 'file-upload';
          case 'textarea':
            return 'textbox';
          default:
            return `input-${t.type}`;
        }
      })(),
    );
}
function u(t) {
  t.hasAttribute('required') && t.setAttribute('aria-required', 'true');
}
function n2(t, e) {
  t.type === 'radio'
    ? (e.forEach((r2) => r2.removeAttribute('aria-checked')), t.setAttribute('aria-checked', t.checked ? 'true' : 'false'))
    : t.type === 'checkbox' && t.setAttribute('aria-checked', t.checked ? 'true' : 'false');
}
function s(t, e) {
  t.hasAttribute('aria-role') || t.setAttribute('aria-role', e ? 'row' : 'form');
}
function c(t) {
  Array.from(t.querySelectorAll('button:not([aria-role])')).forEach((r2) => r2.setAttribute('aria-role', 'button'));
}

// ../formula/dist/src/lib/form/extract.mjs
function n3(a2) {
  const r2 = [];
  for (let f = 0; f < a2.length; f++) a2[f].selected && r2.push(a2[f].value);
  return r2;
}
function A(a2, r2, f, c2) {
  if (f) {
    const i2 = Array.isArray(r2) ? r2 : [];
    c2.forEach((l2, e) => {
      l2.type === 'checkbox' ? (l2.checked = i2.includes(l2.value)) : (l2.value = String(i2[e] ?? ''));
    });
  } else if (a2 instanceof HTMLSelectElement) {
    const i2 = Array.isArray(r2) ? r2 : [r2];
    Array.from(a2.options).forEach((l2) => {
      l2.selected = i2.includes(l2.value);
    });
  } else
    a2.type === 'checkbox'
      ? (a2.checked = !!r2)
      : a2.type === 'radio'
        ? c2.forEach((i2) => (i2.checked = r2 === i2.value))
        : a2.type === 'file'
          ? (a2.files = r2 instanceof FileList ? r2 : null)
          : (a2.value = String(r2 ?? ''));
}
function V(a2, r2, f) {
  let c2;
  if (a2 instanceof HTMLSelectElement) c2 = a2.multiple ? n3(a2.options) : a2.value || null;
  else
    switch (a2.type) {
      case 'number':
      case 'range':
        c2 = r2
          ? f.map((l2) => parseFloat(l2.value)).filter((l2) => !isNaN(l2))
          : (() => {
              const l2 = parseFloat(a2.value);
              return isNaN(l2) ? null : l2;
            })();
        break;
      case 'checkbox':
        c2 = r2 ? f.filter((l2) => l2.checked).map((l2) => l2.value) : a2.checked;
        break;
      case 'radio':
        const i2 = f.find((l2) => l2.checked);
        c2 = i2 ? i2.value : null;
        break;
      case 'file':
        c2 = a2.files;
        break;
      default:
        c2 = r2 ? f.map((l2) => l2.value) : a2.value || null;
    }
  return c2;
}
function E(a2, r2, f, c2) {
  const i2 = f.formValues.get(),
    l2 = m(a2, r2, i2, c2);
  let e = false;
  return (
    r2[0].type !== 'radio' && (e = !r2[0].multiple && r2.length > 1),
    (t, d, o4) => {
      var _a, _b, _c, _d;
      let s4;
      if (
        (d && ((_a = c2 == null ? void 0 : c2.defaultValues) == null ? void 0 : _a[a2]) !== void 0
          ? (s4 = e
              ? ((_b = c2 == null ? void 0 : c2.defaultValues) == null ? void 0 : _b[a2]) || []
              : ((_c = c2 == null ? void 0 : c2.defaultValues) == null ? void 0 : _c[a2]) || '')
          : (s4 = f.formValues.get()[a2] ?? (e ? [] : '')),
        !o4)
      ) {
        const u3 = V(t, e, r2);
        (u3 === null && !d && (Array.isArray(s4) ? s4.length > 0 : s4 !== '') && (s4 = ''), u3 !== null && (s4 = d && e && Array.isArray(u3) && u3.length === 0 ? s4 : u3));
      }
      ((d || o4) && A(t, s4, e, r2), n2(t, r2));
      let h = a2;
      return (
        ((_d = t.dataset) == null ? void 0 : _d.formulaName) && (h = t.dataset.formulaName),
        {
          name: h,
          value: s4,
          ...l2(t, s4),
        }
      );
    }
  );
}

// ../formula/dist/src/lib/form/enrichment.mjs
function u2(r2, n5) {
  return (t) => {
    var _a;
    return Object.entries(((_a = n5 == null ? void 0 : n5.enrich) == null ? void 0 : _a[r2]) ?? {}).reduce((e, [c2, i2]) => ((e[c2] = i2(t)), e), {});
  };
}

// ../formula/dist/src/lib/form/event.mjs
function s2(r2, e) {
  const t = e.formValues.get();
  e.formValidity.set({});
  const l2 = Object.entries(r2),
    n5 = {};
  for (const [a2, f] of l2) {
    const i2 = f(t);
    i2 !== null && (n5[a2] = i2);
  }
  Object.keys(n5).length > 0 && (e.formValidity.set(n5), e.formValid.set(false));
}
function g(r2, e, t, l2, n5) {
  const { name: a2, value: f, ...i2 } = r2;
  if ((e.formValues.set({ ...e.formValues.get(), [a2]: f }), l2.size)) {
    const c2 = { ...e.formValues.get() };
    (l2.forEach((u3, d) => {
      c2[d] = u3.length > 1 ? u3.map((m2) => m2.value) : u3[0].value;
    }),
      e.formValues.set(c2));
  }
  (e.errors.set({ ...e.errors.get(), [a2]: i2 }),
    e.formValid.set(Object.values(e.errors.get()).every((c2) => c2.valid)),
    (t == null ? void 0 : t.formValidators) && s2(t.formValidators, e),
    n5 && e.enrichment.set({ ...e.enrichment.get(), [a2]: n5(f) }),
    typeof (t == null ? void 0 : t.postChanges) == 'function' && t.postChanges(e.formValues.get()));
}
function v2(r2, e, t, l2, n5) {
  return (a2) => {
    const f = (a2 == null ? void 0 : a2.currentTarget) ?? (a2 == null ? void 0 : a2.target),
      i2 = r2(f, false, false);
    (typeof (t == null ? void 0 : t.preChanges) == 'function' && t.preChanges(i2), g(i2, e, t, l2, n5));
  };
}
function b(r2, e, t, l2, n5, a2, f) {
  var _a;
  const i2 = E(r2, l2, n5, a2);
  let c2;
  ((_a = a2 == null ? void 0 : a2.enrich) == null ? void 0 : _a[r2]) && (c2 = u2(r2, a2));
  const u3 = v2(i2, n5, a2, f, c2);
  return (t.addEventListener(e, u3), () => t.removeEventListener(e, u3));
}
function E2(r2, e) {
  return () => {
    (e.noValidate || e.reportValidity(), r2.formValues.subscribe((t) => r2.submitValues.set(t))());
  };
}

// ../formula/dist/src/lib/form/init.mjs
function y(f, u3, e, n5) {
  var _a;
  const c2 = {},
    r2 = {},
    l2 = {};
  for (const [t, a2] of u3) {
    const m2 = E(t, a2, e, n5),
      { name: i2, value: s4, ...o4 } = m2(a2[0], true, false);
    if (((c2[i2] = s4), (r2[i2] = o4), (_a = n5 == null ? void 0 : n5.enrich) == null ? void 0 : _a[i2])) {
      const V2 = u2(i2, n5);
      l2[i2] = V2(s4);
    }
  }
  return (
    e.formValues.set({ ...c2 }),
    e.initialValues.set({ ...c2 }),
    e.errors.set({ ...r2 }),
    e.formValid.set(Object.values(r2).every((t) => t.valid)),
    e.enrichment.set({ ...l2 }),
    [c2, r2, l2]
  );
}
function b2(f, u3, e, n5) {
  const [c2, r2, l2] = y(f, u3, e, n5);
  return () => {
    (e.formValues.set(c2),
      e.errors.set(r2),
      e.formValid.set(Object.values(r2).every((t) => t.valid)),
      e.enrichment.set(l2),
      e.touched.set(Object.keys(c2).reduce((t, a2) => ({ ...t, [a2]: false }), {})),
      e.dirty.set(Object.keys(c2).reduce((t, a2) => ({ ...t, [a2]: false }), {})));
    for (const [t, a2] of u3) E(t, a2, e, n5)(a2[0], false, true);
  };
}

// ../formula/dist/src/lib/form/touch.mjs
function a(r2, u3, t) {
  const o4 = /* @__PURE__ */ new Map(),
    c2 = () => {
      for (const [e, n5] of o4) (e.setAttribute('data-formula-touched', 'true'), e.removeEventListener('focus', n5));
      o4.clear();
    };
  t.touched.set({ ...t.touched.get(), [r2]: false });
  const d = () => () => {
    (t.touched.set({ ...t.touched.get(), [r2]: true }), c2());
  };
  for (const e of u3) {
    const n5 = d();
    (e.addEventListener('focus', n5), o4.set(e, n5));
  }
  return c2;
}

// ../formula/dist/src/lib/form/dirty.mjs
var o3 = (n5, r2) => n5.length === r2.length && n5.every((e) => r2.includes(e));
function b3(n5, r2, e) {
  const l2 = /* @__PURE__ */ new Map(),
    u3 = /* @__PURE__ */ new Map();
  let s4;
  const a2 = () => {
    for (const [t, i2] of l2) (t.setAttribute('data-formula-dirty', 'true'), t.removeEventListener('blur', i2));
    (l2.clear(), s4 && (s4(), (s4 = void 0)));
  };
  (e.dirty.set({ ...e.dirty.get(), [n5]: false }), e.formValues.subscribe((t) => u3.set(n5, t[n5]))(), (s4 = void 0));
  function d(t) {
    return () => {
      const i2 = u3.get(t),
        c2 = e.formValues.get();
      (Array.isArray(c2[t]) ? !o3(c2[t], i2) : c2[t] !== i2) && (e.dirty.set({ ...e.dirty.get(), [t]: true }), a2());
    };
  }
  for (const t of r2) {
    const i2 = d(n5);
    (t.addEventListener('blur', i2), l2.set(t, i2));
  }
  return a2;
}

// ../../node_modules/nanostores/clean-stores/index.js
var clean = Symbol('clean');

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
        $atom.listen(() => {})();
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
          listenerQueue[lqIndex](listenerQueue[lqIndex + 1], listenerQueue[lqIndex + 2], listenerQueue[lqIndex + 3]);
        }
        listenerQueue.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {},
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
    value: initialValue,
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
  $map.setKey = function (key, value) {
    let oldMap = $map.value;
    if (typeof value === 'undefined' && key in $map.value) {
      $map.value = { ...$map.value };
      delete $map.value[key];
      $map.notify(oldMap, key);
    } else if ($map.value[key] !== value) {
      $map.value = {
        ...$map.value,
        [key]: value,
      };
      $map.notify(oldMap, key);
    }
  };
  return $map;
};

// ../formula/dist/src/lib/shared/stores.mjs
function S(t, l2, i2) {
  return t.reduce((n5, s4) => ({ ...n5, [s4]: i2(s4, l2) }), {});
}
function F(t, l2) {
  const i2 = { ...(t == null ? void 0 : t.defaultValues), ...l2 },
    n5 = Object.keys(i2),
    s4 = S(n5, i2, () => false),
    r2 = S(n5, i2, () => ({
      valid: true,
      invalid: false,
      message: '',
      errors: {},
    })),
    o4 = S(Object.keys((t == null ? void 0 : t.formValidators) || {}), i2, () => ''),
    d = Object.entries((t == null ? void 0 : t.enrich) || {}).reduce(
      (V2, [u3, m2]) => ({
        ...V2,
        [u3]: Object.entries(m2).reduce((c2, [f, y2]) => {
          var _a, _b;
          return {
            ...c2,
            [f]: ((_a = t == null ? void 0 : t.defaultValues) == null ? void 0 : _a[u3]) ? y2((_b = t == null ? void 0 : t.defaultValues) == null ? void 0 : _b[u3]) : void 0,
          };
        }, {}),
      }),
      {},
    );
  return {
    initialValues: i2,
    initialKeys: n5,
    initialFieldState: s4,
    initialValidity: r2,
    initialFormValidity: o4,
    initialEnrichment: d,
  };
}
function b4(t, l2) {
  const i2 = F(t, l2);
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
    enrichment: map(i2.initialEnrichment),
  };
}
function O(t) {
  const l2 = (t == null ? void 0 : t.defaultValues) || [],
    { defaultValues: i2, ...n5 } = t || {},
    s4 = l2.map((c2) => F({ ...n5, defaultValues: c2 })),
    r2 = (c2) => s4.reduce((f, y2) => [...f, y2[c2]], []),
    o4 = r2('initialValues'),
    d = r2('initialFieldState'),
    V2 = r2('initialValidity'),
    u3 = r2('initialEnrichment'),
    m2 = r2('initialFormValidity');
  return {
    formValues: atom(o4),
    submitValues: atom([]),
    initialValues: atom(o4),
    touched: atom(d),
    dirty: atom(d),
    errors: atom(V2),
    formValidity: atom(m2),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: atom(u3),
  };
}

// ../formula/dist/src/lib/form/form.mjs
function P(v3, c2, H, M) {
  const n5 = /* @__PURE__ */ new Map(),
    d = /* @__PURE__ */ new Map(),
    u3 = /* @__PURE__ */ new Set(),
    m2 = /* @__PURE__ */ new Set(),
    e = b4(v3, M),
    E3 = typeof H < 'u',
    L = v3;
  let l2,
    w = () => {},
    h = [];
  function A2(t, s4 = {}) {
    ((s4 == null ? void 0 : s4.preChanges) ||
      (s4.preChanges = () => {
        var _a;
        (_a = t == null ? void 0 : t.parentElement) == null ? void 0 : _a.dispatchEvent(new CustomEvent('form:preChanges', { detail: void 0 }));
      }),
      (s4 == null ? void 0 : s4.postChanges) ||
        (s4.postChanges = (i2) => {
          var _a;
          (_a = t == null ? void 0 : t.parentElement) == null ? void 0 : _a.dispatchEvent(new CustomEvent('form:postChanges', { detail: i2 }));
        }));
    const F2 = E3 ? o(t) : n(t);
    (t.setAttribute(`data-formula-${E3 ? 'row' : 'form'}`, 'true'),
      s(t, E3),
      c(t),
      (h = [
        ...F2.reduce((i2, a2) => {
          const p = a2.dataset.formulaName || a2.getAttribute('name') || '';
          return i2.set(p, [...(i2.get(p) || []), a2]);
        }, /* @__PURE__ */ new Map()),
      ]),
      (w = b2(t, h, e, s4)),
      h.forEach(([i2, a2]) => {
        if (a2[0].type === 'hidden') {
          d.set(i2, a2);
          return;
        }
        (u3.add(a(i2, a2, e)),
          m2.add(b3(i2, a2, e)),
          a2.forEach((r2) => {
            (E3 && H && r2.setAttribute('data-in-group', H), o2(r2, a2), u(r2));
            const p = r2.dataset.formulaBind;
            if (p) {
              const y2 = [];
              (p.split('|').forEach((f) => {
                y2.push(b(i2, f, r2, a2, e, s4, d));
              }),
                n5.set(r2, y2));
            } else if (r2 instanceof HTMLSelectElement) n5.set(r2, [b(i2, 'change', r2, a2, e, s4, d)]);
            else {
              const y2 = ['radio', 'checkbox', 'file', 'range', 'color', 'date', 'time', 'week', 'number'],
                f = [];
              (y2.includes(r2.type) && f.push(b(i2, 'change', r2, a2, e, s4, d)), r2.type !== 'hidden' && f.push(b(i2, 'keyup', r2, a2, e, s4, d)), f.length > 0 && n5.set(r2, f));
            }
          }));
      }),
      t.id && c2 && c2.set(t.id, e),
      t instanceof HTMLFormElement && ((l2 = E2(e, t)), t.addEventListener('submit', l2)),
      e.formReady.set(true));
  }
  let o4;
  function C() {
    ([...n5].forEach(([t, s4]) => {
      var _a;
      ((_a = t.setCustomValidity) == null ? void 0 : _a.call(t, ''), s4.forEach((F2) => F2()));
    }),
      [...u3, ...m2].forEach((t) => t()),
      [n5, u3, m2].forEach((t) => t.clear()),
      l2 && o4 instanceof HTMLFormElement && o4.removeEventListener('submit', l2));
  }
  return {
    init: (t) => (
      (o4 = t),
      A2(t, v3),
      {
        root: t,
        elements: h,
        destroy: () => {
          (e.formReady.set(false), C(), o4.id && c2 && c2.delete(o4.id));
        },
      }
    ),
    updateForm: (t) => {
      (e.formReady.set(false), C(), A2(o4, t || L));
    },
    destroyForm: () => {
      (e.formReady.set(false), C(), o4.id && c2 && c2.delete(o4.id));
    },
    resetForm: () => {
      (w(),
        [...u3, ...m2].forEach((t) => t()),
        h.forEach(([t, s4]) => {
          (u3.add(a(t, s4, e)), m2.add(b3(t, s4, e)));
        }));
    },
    stores: e,
    ...e,
  };
}

// ../formula/dist/src/lib/webcomponent/lib.mjs
function s3(o4) {
  const t = /* @__PURE__ */ new Map();
  for (const n5 in o4) {
    const e = n5
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((r2) => r2.toLowerCase());
    (e.length === 1 && e.unshift('form'), t.set(n5, e.join(':')));
  }
  return t;
}

// ../formula/dist/webcomponent.mjs
var _t, _n_instances, o_fn, s_fn, i_fn, _e;
var n4 = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _n_instances);
    __publicField(this, 'handleSubmit', true);
    __publicField(this, 'rootSelector');
    __publicField(this, 'formulaOptions');
    __publicField(this, 'options');
    __publicField(this, 'formula');
    __publicField(this, 'form');
    __publicField(this, 'formEl');
    __publicField(this, 'eventNames');
    __privateAdd(this, _t, []);
    __privateAdd(this, _e, (t) => {
      (t.preventDefault(),
        t.stopPropagation(),
        this.dispatchEvent(
          new CustomEvent('form:submit', {
            bubbles: true,
            detail: this.formula.stores.formValues.get(),
          }),
        ));
    });
  }
  connectedCallback() {
    window.requestAnimationFrame(() => __privateMethod(this, _n_instances, i_fn).call(this));
  }
  disconnectedCallback() {
    (this.handleSubmit && this.formEl && this.formEl.removeEventListener('submit', __privateGet(this, _e)),
      __privateGet(this, _t).forEach((t) => t()),
      __privateSet(this, _t, []),
      this.form && this.form.destroy());
  }
};
_t = new WeakMap();
_n_instances = new WeakSet();
o_fn = function () {
  ((this.options = this.hasAttribute('formula-options') ? JSON.parse(this.getAttribute('formula-options')) : void 0),
    (this.rootSelector = this.getAttribute('root-selector') ?? void 0));
};
s_fn = function () {
  ((this.formEl = this.rootSelector ? (document ?? this).querySelector(this.rootSelector) : this.firstElementChild),
    this.getAttribute('handle-submit') === 'true' && this.formEl.addEventListener('submit', __privateGet(this, _e).bind(this)));
};
i_fn = function () {
  (__privateMethod(this, _n_instances, o_fn).call(this),
    __privateMethod(this, _n_instances, s_fn).call(this),
    (this.formula = P(this.options || {}, void 0, void 0, {})),
    (this.eventNames = s3(this.formula.stores)),
    this.dispatchEvent(new CustomEvent('form:init', { bubbles: true, detail: this.formula })),
    (this.form = this.formula.init(this.formEl)),
    this.dispatchEvent(new CustomEvent('form:connect', { bubbles: true, detail: this.form })),
    Object.entries(this.formula.stores).forEach(([t, e]) => {
      const o4 = e.subscribe((s4) =>
        this.dispatchEvent(
          new CustomEvent(this.eventNames.get(t), {
            bubbles: true,
            detail: s4,
          }),
        ),
      );
      __privateGet(this, _t).push(o4);
    }));
};
_e = new WeakMap();
customElements.define('formula-form', n4);

export { O, P, n4 as n };
//# sourceMappingURL=chunk-LP7776QL.js.map
