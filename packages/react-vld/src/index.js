import { createContext, createElement, useContext, useLayoutEffect, useRef, useReducer } from 'react'
import { createValidatorContext, createValidator } from '../../../src'

const ValidatorContext = createValidatorContext({ createContext })

export const Validator = createValidator({
  ValidatorContext, createElement, useContext, useLayoutEffect, useRef, useReducer,
})

export { ValidationError } from '../../../src'
