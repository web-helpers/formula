import { atom, map } from 'nanostores';

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
 * @param {FormulaOptions=} options Initial options to use
 * @param {any} initialData
 */
function createFirstState(options, initialData) {
  let initialValues = options?.defaultValues || {};
  initialValues = { ...initialValues, ...initialData };
  const initialKeys = Object.keys(initialValues);

  // Generate from default values any initial touched and dirty states
  const initialFieldState = initialKeys.reduce(
    (val, key) => ({ ...val, [key]: false }),
    {}
  );
  // Generate from default values any initial initial validity
  const initialValidity = initialKeys.reduce(
    (val, key) => ({
      ...val,
      [key]: {
        valid: true,
        invalid: false,
        message: '',
        errors: {},
      },
    }),
    {}
  );
  // Generate from default values any initial form validity
  const initialFormValidity = Object.keys(options?.formValidators || {}).reduce(
    (val, key) => ({
      ...val,
      [key]: '',
    }),
    {}
  );
  // Generate from default values any initial enrichment
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
 * @param {FormulaOptions} options
 * @param {any} initialData
 *
 * @returns An object containing the stores for the form instance
 */
export function createFormStores(options, initialData) {
  const initialStoreState = createFirstState < T > (options, initialData);
  return {
    formValues: map(initialStoreState.initialValues),
    submitValues: map({}),
    initialValues: map(initialStoreState.initialValues),
    touched: map(initialStoreState.initialFieldState),
    dirty: map(initialStoreState.initialFieldState),
    validity: map(initialStoreState.initialValidity),
    formValidity: map(initialStoreState.initialFormValidity),
    isFormValid: atom(false),
    isFormReady: atom(false),
    enrichment: map(initialStoreState.initialEnrichment),
  };
}

/**
 * Create a group store which contains arrays of form store values
 * @param {BeakerOptions} options
 * @returns {BeakerStores<T>}
 */
export function createGroupStores(options) {
  let initialValues = [];
  let initialFieldState = [];
  let initialValidity = [];
  let initialEnrichment = [];
  let initialFormValidity = [];

  if (options?.defaultValues?.length > 0) {
    const { defaultValues, ...rest } = options;
    const eachState = defaultValues.map((d) =>
      createFirstState({ ...rest, defaultValues: d })
    );
    for (let i = 0; i < eachState.length; i++) {
      initialValues = [...initialValues, eachState[i].initialValues];
      initialFieldState = [
        ...initialFieldState,
        eachState[i].initialFieldState,
      ];
      initialValidity = [...initialValidity, eachState[i].initialValidity];
      initialEnrichment = [
        ...initialEnrichment,
        eachState[i].initialEnrichment,
      ];
      initialFormValidity = [
        ...initialFormValidity,
        eachState[i].initialFormValidity,
      ];
    }
  }

  return {
    formValues: atom(initialValues),
    submitValues: atom([]),
    initialValues: atom(initialValues),
    touched: atom(initialFieldState),
    dirty: atom(initialFieldState),
    validity: atom(initialValidity),
    formValidity: atom(initialFormValidity),
    isFormValid: atom(false),
    isFormReady: atom(false),
    enrichment: atom(initialEnrichment),
  };
}
