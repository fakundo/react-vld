# react-vld / preact-vld

[![npm](https://img.shields.io/npm/v/react-vld.svg)](https://www.npmjs.com/package/react-vld)

Simple and flexible validation for React and Preact components. 

- The main thing here is a `Validator` component. 

- The Validator accepts `children` prop as a function and passes the validation state as a parameter to it.

- Validator has a functional `rule` prop. If a `ValidationError` was thrown within the `rule`, then validation fails, and the Validator changes status.

- By default, Validator is rerendered every time the validation status changes.

- You can nest Validator components. The parent Validator fails when any of the child Validators fails.

## Installation

For React
```
npm install react-vld
```

For Preact
```
npm install preact-vld
```

## Usage

Example of Input component

```javascript
import { Validator, ValidationError } from 'react-vld' // or from 'preact-vld'

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
import { Validator, ValidationError } from 'react-vld' // or from 'preact-vld'

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

- `rule()` - used to get new validation state

- `mapError(validationError)` - used to transform validation error, may be used for adding some payload

#### Validation object (passes as parameter to Validator `children` prop function)

- `validate({ updateComponent = true } = {})` - invokes validation (calling `rule` and also calling `validate` for every child Validators)

- `resetValidation({ updateComponent = true } = {})` - resets validation state (also calling `resetValidation` for every child Validators)

- `isValid` - `true` if validation is valid

- `isInvalid` - `true` if validation is invalid

- `validationError` - validation error, `undefined` when validation is not invalid

#### ValidationError

- `constructor(message, payload)`

## License

MIT
