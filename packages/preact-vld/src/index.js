import { createContext, createElement } from 'preact'
import { useContext, useLayoutEffect, useRef, useReducer } from 'preact/hooks'
import { createValidatorContext, createValidator } from '../../../src'

const ValidatorContext = createValidatorContext({ createContext })

export const Validator = createValidator({
  ValidatorContext, createElement, useContext, useLayoutEffect, useRef, useReducer,
})

export { ValidationError } from '../../../src'
