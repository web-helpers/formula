import { atom, map } from 'nanostores';

/**
 * A set of stores used by Formula to store the current state
 * @typedef {object} FormulaStores
 * @property {import('nanostores').MapStore} formValues
 * @property {import('nanostores').MapStore} submitValues
 * @property {import('nanostores').MapStore} initialValues
 * @property {import('nanostores').MapStore} touched
 * @property {import('nanostores').MapStore} dirty
 * @property {import('nanostores').MapStore} validity
 * @property {import('nanostores').MapStore} formValidity
 * @property {import('nanostores').MapStore} enrichment
 * @property {import('nanostores').Atom} formValid
 * @property {import('nanostores').Atom} formReady
 */

/**
 * A set of stores used by Formula to store the current state
 * @typedef {object} BeakerStores
 * @property {import('nanostores').Atom} formValues
 * @property {import('nanostores').Atom} submitValues
 * @property {import('nanostores').Atom} initialValues
 * @property {import('nanostores').Atom} touched
 * @property {import('nanostores').Atom} dirty
 * @property {import('nanostores').Atom} validity
 * @property {import('nanostores').Atom} formValidity
 * @property {import('nanostores').Atom} enrichment
 * @property {import('nanostores').Atom} formValid
 * @property {import('nanostores').Atom} formReady
 */

/**
 * Generate initial state for specified key set
 * @private
 * @internal
 *
 * @param {string[]} keys
 * @param {any} initialState
 * @param {function} stateGenerator
 * @returns {object}
 */
function generateInitialState(keys, initialState, stateGenerator) {
  return keys.reduce((state, key) => {
    return { ...state, [key]: stateGenerator(key, initialState) };
  }, {});
}

/**
 * Function to create initial state values for the store using any passed default values, this is not the final initial
 * state, but is used when the stores are created to ensure required keys are available with any initial state, even if
 * an empty string.
 *
 * This avoids the need for the `?.` operator in code since we can guarantee the key on first subscription this way
 *
 * @private
 * @internal
 *
 * @param {import('../form/form.mjs').FormulaOptions=} options Initial options to use
 * @param {Record<string, any>=} initialData Initial data to use
 */
function createFirstState(options, initialData) {
  const initialValues = { ...options?.defaultValues, ...initialData };
  const initialKeys = Object.keys(initialValues);

  const initialFieldState = generateInitialState(
    initialKeys,
    initialValues,
    () => false
  );
  const initialValidity = generateInitialState(
    initialKeys,
    initialValues,
    () => ({
      valid: true,
      invalid: false,
      message: '',
      errors: {},
    })
  );
  const initialFormValidity = generateInitialState(
    Object.keys(options?.formValidators || {}),
    initialValues,
    () => ''
  );

  const initialEnrichment = Object.entries(options?.enrich || {}).reduce(
    (value, [key, fns]) => {
      return {
        ...value,
        [key]: Object.entries(fns).reduce(
          (v, [k, fn]) => ({
            ...v,
            [k]: options?.defaultValues?.[key]
              ? fn(options?.defaultValues?.[key])
              : undefined,
          }),
          {}
        ),
      };
    },
    {}
  );

  return {
    initialValues,
    initialKeys,
    initialFieldState,
    initialValidity,
    initialFormValidity,
    initialEnrichment,
  };
}

/**
 * Create the stores for the the form instance, these can be set using the `defaultValue` property
 * of FormulaOptions
 * @param {import('../form/form.mjs').FormulaOptions=} options
 * @param {Record<string, any>=} initialData
 *
 * @returns {FormulaStores} An object containing the stores for the form instance
 */
export function createFormStores(options, initialData) {
  const initialStoreState = createFirstState(options, initialData);
  return {
    formValues: map(initialStoreState.initialValues),
    submitValues: map({}),
    initialValues: map(initialStoreState.initialValues),
    touched: map(initialStoreState.initialFieldState),
    dirty: map(initialStoreState.initialFieldState),
    validity: map(initialStoreState.initialValidity),
    formValidity: map(initialStoreState.initialFormValidity),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: map(initialStoreState.initialEnrichment),
  };
}

/**
 * Create a group store which contains arrays of form store values
 * @param {import('../group/group.mjs').BeakerOptions=} options
 * @returns {BeakerStores}
 */
export function createGroupStores(options) {
  const defaultValues = options?.defaultValues || [];
  const { defaultValues: _, ...restOptions } = options;

  const eachState = defaultValues.map((defaultValue) =>
    createFirstState({ ...restOptions, defaultValues: defaultValue })
  );

  /**
   *
   * @param {string} property
   * @returns {string[]}
   */
  const combineStates = (property) =>
    eachState.reduce((accumulator, currentState) => {
      return [...accumulator, currentState[property]];
    }, []);

  const initialValues = combineStates('initialValues');
  const initialFieldState = combineStates('initialFieldState');
  const initialValidity = combineStates('initialValidity');
  const initialEnrichment = combineStates('initialEnrichment');
  const initialFormValidity = combineStates('initialFormValidity');

  return {
    formValues: atom(initialValues),
    submitValues: atom([]),
    initialValues: atom(initialValues),
    touched: atom(initialFieldState),
    dirty: atom(initialFieldState),
    validity: atom(initialValidity),
    formValidity: atom(initialFormValidity),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: atom(initialEnrichment),
  };
}
