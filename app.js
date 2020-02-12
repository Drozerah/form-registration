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
    }

    /**
    * Debug
    */
    Debug () {
      console.log(this.elements) // !DEBUG
      console.log(this.username) // !DEBUG
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
    * Check Passwords
    */
    IsPasswordsEquals () {
      return new Promise((resolve, reject) => {
        if ((!this.password) || (!this.confirm)) {
          const ErrorMsg = 'Error: elements with class off \'password\' or \'confirm_password\' are required in form template.'
          console.error(ErrorMsg)
          // Send error message
          const error = {
            success: false,
            msg: ErrorMsg
          }
          return reject(error)
        }
        // Make equality validation
        if (this.password.value === this.confirm.value) return resolve(true)
        // Send error message
        const error = {
          success: false,
          details: [
            {
              msg: 'Invalid passwords.',
              value: {
                password: this.password.value,
                confirm: this.confirm.value
              }
            }
          ]
        }
        return reject(error)
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
    * Flash Message
    */
    Display (response) {
      if (!response.details) {
        console.warn('Info: no error details to display because off missing template elements')
      } else {
        const [detail] = [...response.details]
        this.message.classList = []
        if (!response.success) {
          this.message.innerHTML = detail.msg
          this.message.classList.add('error')
        } else {
          this.message.innerHTML = detail.msg
          this.message.classList.add('success')
        }
      }
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
      // const formData = await this.GetFormData()
      if (validatePasswords) {
        const confirmationMsg = {
          username: this.username.value,
          email: this.email.value,
          password: this.password.value
        }
        const msg = `Please confirm your registration:\n ${JSON.stringify(confirmationMsg, null, 2)}`
        // prompt confirmation
        if (!confirm(msg)) {
          console.log('confirmation aborted') // !DEBUG
        } else {
          this.AddOverlaySpinner()
          setTimeout(() => {
            this.RemoveOverlaySpinner()
            console.log('confirmed') // !DEBUG
            this.Display(this.GetFormData())
            // reset form
            console.log('form reset') // !DEBUG
            e.target.reset()
          }, 500)
        }
      }
    } catch (error) {
      console.log('error case') // !DEBUG
      this.Display(error)
    }
  })
})()
