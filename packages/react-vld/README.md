# react-vld

[![npm](https://img.shields.io/npm/v/react-vld.svg)](https://www.npmjs.com/package/react-vld)

Simple and flexible validation for React components. The main thing here is the `Validator` component. 

- Validator accepts `children` prop as a function and passes the validation state as a parameter to it.

- Validator has a functional `rule` prop. If within the rule the `ValidationError` exception was thrown then the validation will fail and the Validator will change its status.

- By default Validator is rerendered every time when validation status changes.

- You can nest Validator components. The parent Validator fails when any of the child Validators fail.

## Installation

```
npm install react-vld
```

## Usage

Example of Input component

```javascript
import React, { Fragment, useState, useCallback } from 'react'
import { Validator, ValidationError } from 'react-vld'

export default () => {
  const [value, setValue] = useState('')

  const checkValue = useCallback(() => {
    if (value.trim() === '') {
      throw new ValidationError('Required field')
    }
  }, [value])

  const handleChange = useCallback((ev) => {
    setValue(ev.target.value)
  }, [])
  
  return (
    <Validator rule={checkValue}>
      { ({ validate, isInvalid, validationError }) => (
        <Fragment>
          <input 
            value={value}
            onChange={handleChange}
            onBlur={validate}
          />
          { isInvalid && (
            <div>
              { validationError.message }
            </div>
          ) }
        </Fragment>
      ) }
    </Validator>
  )
}
```

Example of Form component (nesting)

```javascript
import React, { useCallback } from 'react'
import { Validator, ValidationError } from 'react-vld'

export default () => (
  <Validator>
    { ({ validate }) => {
      const handleSubmit = useCallback((ev) => {
        ev.preventDefault()
        if (validate().isValid) {
          alert('Submitted!')
        }
      }, [validate])

      return (
        <form onSubmit={handleSubmit}>
          <Input />
          <button type="submit" />
        </form>
      )
    } }
  </Validator>
)
```

## API

#### Validator props

- `rule()` - used to check the validation status

- `mapError(validationError)` - transforms a validation error

#### Validation state (passes as parameter to Validator `children` prop function)

- `validate({ updateComponent = true } = {})` - invokes validation (checking `rule` and also calling `validate` for every child Validators)

- `resetValidation({ updateComponent = true } = {})` - resets validation (also calling `resetValidation` for every child Validators)

- `isValid` - `true` if validation is valid

- `isInvalid` - `true` if validation is invalid

- `validationError` - validation error, `undefined` when validation is not invalid

#### ValidationError

- `constructor(message, payload)`

## License

MIT
