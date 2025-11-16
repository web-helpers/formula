import { O, P, n } from './chunk-LP7776QL.js';
import './chunk-RGIOIEUU.js';

// ../formula/dist/src/lib/group/group.mjs
var G = 0;
function M(y, l) {
  const t2 = O(y);
  let a, u2;
  const { defaultValues: A = [], ...V } = y || {},
    i = /* @__PURE__ */ new Map(),
    f = /* @__PURE__ */ new Map(),
    p2 = /* @__PURE__ */ new Set();
  function m() {
    (f.forEach((e) => e.destroy()), p2.forEach((e) => e()), f.clear(), i.clear(), p2.clear());
  }
  function h(e) {
    for (const s of Object.keys(t2)) {
      if (['formValues', 'initialValues', 'submitValues'].includes(s)) continue;
      const r = t2[s].get();
      t2[s].set(Array.isArray(r) ? r.slice(0, e.length) : r);
    }
  }
  function S(e, s) {
    const r = Object.entries(e.stores);
    for (const [o, n3] of r) {
      let c = true;
      const O2 = n3.subscribe((k) => {
        if (c && o === 'formValues') {
          c = false;
          return;
        }
        c = false;
        const d = t2[o].get();
        if (Array.isArray(d)) {
          const g = [...d];
          (g.splice(s, 1, k), t2[o].set(g));
        } else t2[o].set(d);
      });
      p2.add(O2);
    }
  }
  function b(e) {
    t2.formReady.set(false);
    const s = t2.formValues.get();
    (m(), h(e));
    for (let r = 0; r < e.length; r++) {
      const o = e[r];
      o.setAttribute('data-beaker-index', `${r}`);
      const n3 = P(
          {
            ...V,
            defaultValues: (A == null ? void 0 : A[r]) || {},
          },
          void 0,
          a,
          s[r] || {},
        ),
        c = n3.init(o);
      (i.set(o, n3), f.set(o, c), S(n3, r));
    }
    t2.formReady.set(true);
  }
  function w(e) {
    ((u2 = new MutationObserver(() => {
      const r = e.querySelectorAll(':scope > *');
      b(Array.from(r));
    })),
      u2.observe(e, { childList: true }));
    const s = e.querySelectorAll(':scope > *');
    b(Array.from(s));
  }
  return {
    group: (e) => (
      e.id ? ((a = e.id), l.set(a, t2)) : ((a = `beaker-group-${G++}`), (e.id = a)),
      e.setAttribute('data-beaker-group', 'true'),
      e.hasAttribute('aria-role') || e.setAttribute('aria-role', 'group'),
      w(e),
      {
        destroy: () => {
          (a && l.delete(a), m(), u2.disconnect());
        },
      }
    ),
    update: (e) => {
      i.forEach((s) => s.updateForm(e));
    },
    destroy: () => {
      (a && l.delete(a), m(), u2.disconnect());
    },
    forms: i,
    stores: t2,
    init: (e) => t2.formValues.set(e),
    add: (e) => t2.formValues.set([...t2.formValues.get(), e]),
    set: (e, s) => {
      const r = [...t2.formValues.get()];
      (r.splice(e, 1, s), t2.formValues.set(r));
    },
    delete: (e) =>
      Object.keys(t2).forEach((s) => {
        const r = t2[s].get();
        if (Array.isArray(r)) {
          const o = [...r];
          (o.splice(e, 1), t2[s].set(o));
        }
      }),
    clear: () => t2.formValues.set([]),
    ...t2,
  };
}

// ../formula/dist/index.mjs
var t = /* @__PURE__ */ new Map();
var n2 = /* @__PURE__ */ new Map();
function p(r) {
  return P(r || {}, t, void 0, {});
}
function u(r) {
  return M(r || {}, n2);
}
export { n as FormulaWebComponent, u as beaker, n2 as beakerStores, p as formula, t as formulaStores };
//# sourceMappingURL=@webhelpers_formula.js.map
