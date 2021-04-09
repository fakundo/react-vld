# preact-vld

[![npm](https://img.shields.io/npm/v/preact-vld.svg)](https://www.npmjs.com/package/preact-vld)

Simple and flexible validation for Preact components. 

- The main thing here is `Validator` component. Use it as a wrapper for your input components, forms, or whatever component you want to validate.

- `Validator` accepts `children` prop as a function and passes the validation state as a parameter into it.

- For updating validation state `Validator` uses a functional prop - `rule`. If a `ValidationError` was thrown within the `rule`, then validation fails, and the `Validator` updates validation state.

- By default, `Validator` is rerendered every time the validation state is updated.

- You can nest `Validator` components. The parent `Validator` fails when any of the child `Validator` fails.

### Installation

```
npm i preact-vld
```

### Usage

Example of Input component

```js
import { Validator, ValidationError } from 'preact-vld'

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
            onBlur={validate}
            onChange={handleChange}
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

```js
import { Validator, ValidationError } from 'preact-vld'

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

### API

#### `Validator` props

- `rule()` used to calculate new validation state

- `mapError(validationError)` transforms validation error, may be useful for adding some payload to the error

- `children(validationState)`

#### `validationState` has the following structure

- `validate({ updateComponent = true } = {})` invokes validation routine (calling `rule` and also calling `validate` for every child `Validator`)

- `resetValidation({ updateComponent = true } = {})` resets validation state (also calling `resetValidation` for every child `Validator`)

- `isValid` = `true|false|undefined`

- `isInvalid` = `true|false|undefined`

- `validationError` = `ValidationError|undefined`

#### `ValidationError`

- `constructor(message, payload)`

### License

MIT
