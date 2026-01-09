import { atom, map } from 'nanostores';
import type { FormulaStores, BeakerStores, FieldValidity, EnrichFields, FormValidatorFn } from './types.mjs';

interface FormulaOptions {
  defaultValues?: Record<string, unknown>;
  enrich?: EnrichFields;
  formValidators?: Record<string, FormValidatorFn>;
}

interface BeakerOptions extends Omit<FormulaOptions, 'defaultValues'> {
  defaultValues?: Record<string, unknown>[];
}

interface InitialState {
  initialValues: Record<string, unknown>;
  initialKeys: string[];
  initialFieldState: Record<string, boolean>;
  initialValidity: Record<string, FieldValidity>;
  initialFormValidity: Record<string, string>;
  initialEnrichment: Record<string, Record<string, unknown>>;
}

/**
 * Generate initial state for specified key set
 */
function generateInitialState<T>(
  keys: string[],
  initialState: Record<string, unknown>,
  stateGenerator: (key: string, initialState: Record<string, unknown>) => T,
): Record<string, T> {
  return keys.reduce(
    (state, key) => {
      return { ...state, [key]: stateGenerator(key, initialState) };
    },
    {} as Record<string, T>,
  );
}

/**
 * Function to create initial state values for the store using any passed default values
 */
function createFirstState(options?: FormulaOptions, initialData?: Record<string, unknown>): InitialState {
  const initialValues = { ...options?.defaultValues, ...initialData };
  const initialKeys = Object.keys(initialValues);

  const initialFieldState = generateInitialState(initialKeys, initialValues, () => false);
  const initialValidity = generateInitialState(
    initialKeys,
    initialValues,
    (): FieldValidity => ({
      valid: true,
      invalid: false,
      message: '',
      errors: {},
    }),
  );
  const initialFormValidity = generateInitialState(Object.keys(options?.formValidators || {}), initialValues, () => '');

  const initialEnrichment = Object.entries(options?.enrich || {}).reduce(
    (value, [key, fns]) => {
      return {
        ...value,
        [key]: Object.entries(fns).reduce(
          (v, [k, fn]) => ({
            ...v,
            [k]: options?.defaultValues?.[key] ? fn(options?.defaultValues?.[key]) : undefined,
          }),
          {} as Record<string, unknown>,
        ),
      };
    },
    {} as Record<string, Record<string, unknown>>,
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
 * Create the stores for the form instance
 */
export function createFormStores(options?: FormulaOptions, initialData?: Record<string, unknown>): FormulaStores {
  const initialStoreState = createFirstState(options, initialData);
  return {
    formValues: map(initialStoreState.initialValues),
    submitValues: map({}),
    initialValues: map(initialStoreState.initialValues),
    touched: map(initialStoreState.initialFieldState),
    dirty: map(initialStoreState.initialFieldState),
    errors: map(initialStoreState.initialValidity),
    formValidity: map(initialStoreState.initialFormValidity),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: map(initialStoreState.initialEnrichment),
  };
}

/**
 * Create a group store which contains arrays of form store values
 */
export function createGroupStores(options?: BeakerOptions): BeakerStores {
  const defaultValues = options?.defaultValues || [];
  const { defaultValues: _, ...restOptions } = options || {};

  const eachState = defaultValues.map((defaultValue) => createFirstState({ ...restOptions, defaultValues: defaultValue }));

  const combineStates = <K extends keyof InitialState>(property: K): InitialState[K][] =>
    eachState.reduce(
      (accumulator, currentState) => {
        return [...accumulator, currentState[property]];
      },
      [] as InitialState[K][],
    );

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
    errors: atom(initialValidity),
    formValidity: atom(initialFormValidity),
    formValid: atom(false),
    formReady: atom(false),
    enrichment: atom(initialEnrichment),
  };
}
