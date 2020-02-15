export default class ValidationError {
  constructor(message = 'Validation Error', payload = {}) {
    this.message = message
    this.payload = payload
  }
}
