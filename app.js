
const Form = require('./lib/validate')
// Get Form
let RegisterForm = document.forms.register_form
// Instanciate Form class
RegisterForm = new Form(RegisterForm)
// Init Underline Effect
RegisterForm.InitUnderline()
// Init Toogle Visibility
RegisterForm.InitToogleVisibility()

/**
  * Form Submit Event
  */
RegisterForm.Submit(async function (e) {
  this.Debug() // !DEBUG
  try {
    e.preventDefault()
    // reset result object
    this._result = {
      success: undefined,
      details: []
    }
    const validatePasswords = await this.IsPasswordsEquals()
    const validateEmail = await this.ValidateEmail()
    const formData = await this.GetFormData()
    if (validatePasswords && validateEmail) {
      const confirmationMsg = {
        username: this.username.value,
        email: this.email.value,
        password: this.password.value
      }
      const msg = `Please confirm your registration:\n ${JSON.stringify(confirmationMsg, null, 2)}`
      // Prompt a confirmation to user
      if (!confirm(msg)) {
        console.info('Confirmation aborted.')
      } else {
        this.AddOverlaySpinner()
        setTimeout(() => {
          this.RemoveOverlaySpinner()
          console.info('Confirmation confirmed.') // !DEBUG
          // Display validation messages
          this.DisplayHeadMessage(formData)
          this.DisplayFieldsMessage(formData)
          // Reset form
          this.ResetForm()
          console.info(formData)
          console.log(JSON.stringify(formData, null, 2)) // !DEBUG
        }, 500)
      }
    } else {
      console.info('Error Form validation') // !DEBUG
    }
  } catch (error) {
    // Display validation messages
    this.DisplayHeadMessage(error)
    this.DisplayFieldsMessage(error)
    console.info(error) // !DEBUG
    console.log(JSON.stringify(error, null, 2)) // !DEBUG
  }
})
