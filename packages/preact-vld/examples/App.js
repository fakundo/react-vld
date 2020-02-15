/** @jsx h */
import { h, Component } from 'preact'
import { Validator, ValidationError } from '../src'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      inputValue: '',
      subInputValue: '',
    }
  }

  validateInput = () => {
    const { inputValue } = this.state
    if (inputValue === '') {
      throw new ValidationError('Required input value')
    }
  }

  handleInputChange = (inputValidatorProps) => (ev) => {
    const { value } = ev.target
    this.setState({ inputValue: value }, inputValidatorProps.resetValidation)
  }

  handleInputBlur = (inputValidatorProps) => () => {
    inputValidatorProps.validate()
  }

  validateSubInput = () => {
    const { subInputValue } = this.state
    if (subInputValue === '') {
      throw new ValidationError('Required sub input value')
    }
  }

  handleSubInputChange = (subInputValidatorProps) => (ev) => {
    const { value } = ev.target
    this.setState({ subInputValue: value }, subInputValidatorProps.resetValidation)
  }

  handleSubInputBlur = (subInputValidatorProps) => () => {
    subInputValidatorProps.validate()
  }

  handleSubmit = (formValidatorProps) => (ev) => {
    ev.preventDefault()
    formValidatorProps.validate()
  }

  render() {
    const { inputValue, subInputValue } = this.state
    return (
      <Validator>
        { () => (
          <Validator>
            { (formValidatorProps) => (
              <form style={{ background: 'olive', padding: 10 }} onSubmit={this.handleSubmit(formValidatorProps)}>
                <h4>Form</h4>
                <button type="submit">Submit form</button>
                <pre>{ JSON.stringify(formValidatorProps, null, ' ') }</pre>

                <Validator rule={this.validateInput}>
                  { (inputValidatorProps) => (
                    <div style={{ background: 'silver', padding: 10 }}>
                      <h4>Input</h4>
                      <input
                        value={inputValue}
                        onChange={this.handleInputChange(inputValidatorProps)}
                        onBlur={this.handleInputBlur(inputValidatorProps)}
                        style={{
                          margin: 5,
                          border: '3px solid',
                          borderColor: inputValidatorProps.isInvalid ? 'red' : (inputValidatorProps.isValid ? 'green' : 'grey'), // eslint-disable-line
                          outline: 'none',
                        }}
                      />
                      <pre>{ JSON.stringify(inputValidatorProps, null, ' ') }</pre>

                      <Validator rule={this.validateSubInput}>
                        { (subInputValidatorProps) => (
                          <div style={{ background: 'cyan', padding: 10 }}>
                            <h4>Sub input</h4>
                            <input
                              value={subInputValue}
                              onChange={this.handleSubInputChange(subInputValidatorProps)}
                              onBlur={this.handleSubInputBlur(subInputValidatorProps)}
                              style={{
                                margin: 5,
                                border: '3px solid',
                                borderColor: subInputValidatorProps.isInvalid ? 'red' : (subInputValidatorProps.isValid ? 'green' : 'grey'), // eslint-disable-line
                                outline: 'none',
                              }}
                            />
                            <pre>{ JSON.stringify(subInputValidatorProps, null, ' ') }</pre>
                          </div>
                        ) }
                      </Validator>
                    </div>
                  ) }
                </Validator>
              </form>
            ) }
          </Validator>
        ) }
      </Validator>
    )
  }
}
