import React from "react";

// tiny utility function
const isObject = (obj) => obj !== null && typeof obj === "object";

// set all keys of object to true
function setNestedObjectValues(
  object,
  value,
  visited = new WeakMap(),
  response = {}
) {
  for (let k of Object.keys(object)) {
    const val = object[k];
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true);
        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = val;
    }
  }

  return response;
}

// decoupled and testable
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return { ...state, values: { ...state.values, ...action.payload } };

    case "SET_FIELD_TOUCHED":
      return { ...state, touched: { ...state.touched, ...action.payload } };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    case "SUBMIT_ATTEMPT":
      return {
        ...state,
        isSubmitting: true,
        values: setNestedObjectValues(state.values, true)
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false
      };

    case "SUBMIT_FAILURE":
      return {
        ...state,
        isSubmitting: false,
        submitError: action.payload
      };

    default:
      return state;
  }
}

export function useForm(props) {
  // defensive programming,
  if (!props.onSubmit) {
    throw new Error("You forgot to pass onSubmit");
  }
  const [state, dispatch] = React.useReducer(reducer, {
    values: props.initValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitError: undefined
  });
  // we need to use e.persist()
  // try to access event inside callback in React you should use persist
  const handleChange = (fieldName) => (event) => {
    event.persist();
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { [fieldName]: event.target.value }
    });
  };

  const handleBlur = (fieldName) => (event) => {
    event.persist();
    dispatch({
      type: "SET_FIELD_TOUCHED",
      payload: { [fieldName]: true }
    });
  };

  React.useEffect(() => {
    if (props.validate) {
      const errors = props.validate(state.values);
      dispatch({
        type: "SET_ERRORS",
        payload: errors
      });
    }
  }, [state.values]);

  const getFieldProps = (fieldName) => ({
    value: state.values[fieldName],
    onChange: handleChange(fieldName),
    onBlur: handleBlur(fieldName)
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // validation: mark each field as touched
    console.log("handle-submit-call");
    dispatch({ type: "SUBMIT_ATTEMPT" });

    const errors = props.validate(state.values);
    // if no error submit
    if (!Object.keys(errors).length) {
      try {
        const resp = await props.onSubmit(state.values);
        dispatch({ type: "SUBMIT_SUCCESS", payload: resp });
      } catch (submitError) {
        dispatch({ type: "SUBMIT_FAILURE", payload: submitError });
      }
    } else {
      dispatch({ type: "SET_ERRORS", payload: errors });
      dispatch({ type: "SUBMIT_FAILURE" });
    }
  };

  return {
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
    ...state
  };
}
