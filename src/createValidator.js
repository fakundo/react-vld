import ValidationError from './ValidationError'

const initialState = {
  isValid: false,
  isInvalid: false,
  validationError: undefined,
}

const defaultRule = () => {}
const defaultMapError = (e) => e

const createValidator = ({ forceUpdate, rule, mapError }) => {
  const validator = { rule, mapError }
  const childValidators = []
  const childrenProps = { ...initialState }

  const updateState = (nextState, { updateComponent = true } = {}) => {
    Object.assign(childrenProps, nextState)
    if (updateComponent) forceUpdate()
  }

  const getSelfError = () => {
    try {
      validator.rule()
    } catch (error) {
      if (error instanceof ValidationError) {
        return error
      }
      throw error
    }
    return null
  }

  const getChildError = (options) => {
    const childValidatorStates = childValidators.map(
      (childValidator) => childValidator.validate(options),
    )
    const invalidChildStateIndex = childValidatorStates.findIndex((state) => state.isInvalid)
    const invalidChildState = childValidatorStates[invalidChildStateIndex] || null
    return invalidChildState && invalidChildState.validationError
  }

  const validate = (options) => {
    const initialError = getChildError(options) || getSelfError()
    const validationError = initialError && validator.mapError(initialError)
    const nextState = validationError
      ? {
        isValid: false,
        isInvalid: true,
        validationError,
      }
      : {
        isValid: true,
        isInvalid: false,
        validationError: undefined,
      }
    updateState(nextState, options)
    return nextState
  }

  const resetValidation = (options) => {
    updateState(initialState, options)
    childValidators.forEach(
      (childValidator) => childValidator.resetValidation(options),
    )
  }

  const addChildValidator = (childValidator) => {
    childValidators.push(childValidator)
  }

  const removeChildValidator = (childValidator) => {
    const index = childValidators.findIndex((cv) => cv === childValidator)
    if (index >= 0) {
      childValidators.splice(index, 1)
    }
  }

  const providerProps = { value: { addChildValidator, removeChildValidator } }
  Object.assign(childrenProps, { resetValidation, validate })
  Object.assign(validator, { childrenProps, providerProps, validate, resetValidation })
  return validator
}

export default ({
  ValidatorContext, createElement, useContext, useLayoutEffect, useRef, useReducer,
}) => (
  ({
    rule = defaultRule, mapError = defaultMapError, children,
  }) => {
    const validatorRef = useRef()
    const context = useContext(ValidatorContext)
    const [, forceUpdate] = useReducer(() => ({}))

    if (!validatorRef.current) {
      validatorRef.current = createValidator({ forceUpdate, rule, mapError })
    }

    const { current: validator } = validatorRef

    useLayoutEffect(() => {
      validator.rule = rule
      validator.mapError = mapError
    }, [rule, mapError])

    useLayoutEffect(() => {
      if (context) context.addChildValidator(validator)
      return () => {
        if (context) context.removeChildValidator(validator)
      }
    }, [context])

    const { providerProps, childrenProps } = validator
    return createElement(ValidatorContext.Provider, providerProps, children(childrenProps))
  }
)
