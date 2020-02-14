(() => {
  /**
  * Class Validate Form
  */
  class Form {
    constructor (form) {
      this._form = form
      this.elements = this._form.elements || null
      this.username = this.elements.username || null
      this.email = this.elements.email || null
      this.password = this.elements.password || null
      this.confirm = this.elements.confirm_password || null
      this.data = [...this._form.elements].filter(elem => elem.name !== 'submit') || null
      this.underlines = [...this._form.querySelectorAll('.underline')] || null
      this.isVisible = false
      this.visibility = this._form.querySelector('#visibility') || null
      this.message = this._form.querySelector('#message') || null
      this._result = {
        success: undefined,
        details: []
      }
    }

    /**
    * Debug
    */
    Debug () {
      // console.log(this.elements) // !DEBUG
      // console.log(this.username) // !DEBUG
    }

    /**
    * Underline Effect
    */
    InitUnderline () {
      const focusEvents = (element, eventType) => {
        switch (true) {
          case eventType === 'focus':
            element.classList.add('underlineFocus')
            element.classList.remove('underline')
            break
          case eventType === 'focusout':
            element.classList.add('underline')
            element.classList.remove('underlineFocus')
            break
        }
      }
      if (!this.underlines.length > 0) {
        console.error('Error: elements with class of \'underline\' are required in form template.')
      } else {
        this.underlines.forEach(underline => {
          underline.children[0].addEventListener('focus', (e) => focusEvents(e.target.parentElement, 'focus'))
          underline.children[0].addEventListener('focusout', (e) => focusEvents(e.target.parentElement, 'focusout'))
        })
      }
      return this // chainable method
    }

    /**
    * Init Toogle Visibility
    */
    InitToogleVisibility () {
      const passwords = [this.password, this.confirm]
      const toogleVisibility = (target) => {
        if (!this.isVisible) {
          passwords.forEach(element => (element.type = 'text'))
          target.innerHTML = 'visibility_off'
        } else {
          passwords.forEach(element => (element.type = 'password'))
          target.innerHTML = 'visibility'
        }
        this.isVisible = !this.isVisible
      }
      if (!this.visibility) {
        console.error('Error: element with the id attribut  off \'visibility\' is required in form template.')
      } else {
        this.visibility.addEventListener('click', (e) => toogleVisibility(e.target))
      }
      return this // chainable method
    }

    /**
    * Turn visibility on
    */
    VisibilityOn () {
      this.isVisible = false
      this.visibility.innerHTML = 'visibility'
    }

    /**
    * Turn visibility off
    */
    VisibilityOff () {
      this.isVisible = true
      this.visibility.innerHTML = 'visibility_off'
    }

    /**
    * Check Passwords
    */
    IsPasswordsEquals () {
      return new Promise((resolve, reject) => {
        // Error First Traitement
        if ((!this.password) || (!this.confirm)) {
          // Template Error
          // Create error message
          const ErrorMsg = 'Error: Form structure, elements with name off \'password\' or \'confirm_password\' not found.'
          // Print error
          console.error(ErrorMsg)
          // Update this._result Object
          this.NewErrorDetail(ErrorMsg, undefined, '\'password\' or \'confirm_password\'')
          // Reject Promise
          reject(this.result)
          return this // chainable method
        }
        // Validate Passwords
        if (this.password.value !== this.confirm.value) {
          // Create error message
          const ErrorMsg = 'Invalid password confirmation.'
          // Update this._result Object
          this.NewErrorDetail(ErrorMsg, this.password.value, this.password.name)
          // Update this._result Object
          this.NewErrorDetail(ErrorMsg, this.confirm.value, this.confirm.name)
          // Reject promise
          reject(this.result)
          return this // chainable method
        } else {
          // resolve Promise
          resolve(true)
          return this // chainable method
        }
      })
    }

    /**
    * Get Form Data
    */
    GetFormData () {
      const data = this.data.reduce((acc, input) => ({ ...acc, [input.name]: input.value }), {})
      return {
        success: true,
        details: [
          {
            msg: 'Thank you!',
            value: data
          }
        ]
      }
    }

    /**
    * Add Overlay Spinner
    */
    AddOverlaySpinner () {
      const overlay = document.createElement('div')
      overlay.classList.add('overlay')
      this._form.appendChild(overlay)
      this._form.classList.add('action')
    }

    /**
    * Remove Overlay Spinner
    */
    RemoveOverlaySpinner () {
      const overlay = this._form.querySelector('.overlay')
      this._form.removeChild(overlay)
      this._form.classList.remove('action')
    }

    /**
    * Submit Events
    *
    * @param {Function} cb a callback function
    * @returns {Method} return an event listener
    */
    Submit (cb) {
      return this._form.addEventListener('submit', cb.bind(this))
    }

    /**
     * Update this._result Object
     * @param  {String} msg the detail error message
     * @param  {String} value the field value
     * @param  {String} param the field name
     */
    NewErrorDetail (msg, value, param) {
      // update success status
      this.UpdateSuccess(false)
      const detail = { param, msg, value }
      // if detail.param already exit => update its value else push detail
      const exist = this.result.details.filter(error => error.param === detail.param)[0] || null
      exist != null ? exist.value = detail.value : this.PushDetail(detail)
    }

    /**
    * Getter
    * @returns {Object} return this._result Object
    */
    get result () { return this._result }

    /**
    * Update this._result.details Array
    * @param {Object} detail the detail Object to push
    */
    PushDetail (detail) { this.result.details.push(detail) }

    /**
    * Update this._result.success prop
    * @param  {Boolean} boolean the property to update
    */
    UpdateSuccess (boolean) { this.result.success = boolean }

    /**
    * Display Head Message
    * @param  {Object} result this._result Object
    */
    DisplayHeadMessage (result) {
      if (!result.details) {
        console.warn('Info: no error details to display because off missing template elements')
      } else {
        const [detail] = [...result.details]
        this.message.classList = []
        if (!result.success) {
          this.message.innerHTML = detail.msg
          this.message.classList.add('error')
        } else {
          this.message.innerHTML = detail.msg
          this.message.classList.add('success')
        }
      }
    }

    /**
    * Display error fields
    * @param  {Object} result this._result Object
    */
    DisplayFielsMessage (result) {
      // Hide existing error fields
      this.HideAllErrorsFields()
      // Error case
      if (result.success === false) {
        result.details.map(input => {
          // expose field content
          if (input.param.includes('password')) {
            this.ExposeThisPasswordField(this.elements[input.param])
          }
          // display current field error
          this.DisplayThisErrorField(this.elements[input.param])
        })
      }
    }

    /**
    * Hide All class name off 'error_field'
    */
    HideAllErrorsFields () {
      const elements = [...this.elements]
      elements.map(element => element.classList.remove('error_field'))
    }

    /**
    * Show passwords fields content
    * @param  {Object} result this DOM element content to reveale
    */
    ExposeThisPasswordField (input) {
      input.type = 'text'
      this.VisibilityOff()
    }

    /**
    * Hide passwords fields content
    * @param  {Object} result this DOM element content to hide
    */
    DisplayThisErrorField (input) {
      input.classList.add('error-field')
    }
  }

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
      const validatePasswords = await this.IsPasswordsEquals()
      const formData = await this.GetFormData()
      if (validatePasswords) {
        const confirmationMsg = {
          username: this.username.value,
          email: this.email.value,
          password: this.password.value
        }
        const msg = `Please confirm your registration:\n ${JSON.stringify(confirmationMsg, null, 2)}`
        // prompt confirmation
        if (!confirm(msg)) {
          console.info('Confirmation aborted.')
        } else {
          this.AddOverlaySpinner()
          setTimeout(() => {
            this.RemoveOverlaySpinner()
            console.info('Confirmation confirmed.') // !DEBUG
            // Display validation messages
            this.DisplayHeadMessage(formData)
            this.DisplayFielsMessage(formData)
            // reset form
            console.log('form reset') // !DEBUG
            e.target.reset()
            console.info(formData)
            console.log(JSON.stringify(formData, null, 2)) // !DEBUG
          }, 500)
        }
      }
    } catch (error) {
      // Display validation messages
      this.DisplayHeadMessage(error)
      this.DisplayFielsMessage(error)
      console.info(error) // !DEBUG
      console.log(JSON.stringify(error, null, 2)) // !DEBUG
    }
  })
})()
