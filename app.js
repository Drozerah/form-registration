(() => {
  /**
  * Get form element
  */
  const form = document.forms.resgistration_form
  /**
  * Class Validate Form
  */
  class Form {
    constructor (form) {
      this.form = form
      this.passwords = [...this.form.elements].filter(elem => elem.name === 'password' || elem.name === 'confirm') || null
      this.data = [...this.form.elements].filter(elem => elem.name !== 'submit') || null
      this.underlines = [...this.form.querySelectorAll('.underline')] || null
      this.isVisible = false
      this.visibility = this.form.querySelector('#visibility') || null
      this.message = this.form.querySelector('#message') || null
    }

    /**
    * Underline Effect
    */
    initUnderline () {
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
      if (this.underlines.length > 0) {
        this.underlines.forEach(underline => {
          underline.children[0].addEventListener('focus', (e) => focusEvents(e.target.parentElement, 'focus'))
          underline.children[0].addEventListener('focusout', (e) => focusEvents(e.target.parentElement, 'focusout'))
        })
      } else {
        console.error('InitUnderline() Error: elements with class of \'underline\' are required in form template.')
      }
      return this // chainable method
    }

    /**
    * Init Toogle Visibility
    */
    initToogleVisibility () {
      const toogleVisibility = (target) => {
        if (!this.isVisible) {
          this.passwords.forEach(element => (element.type = 'text'))
          target.innerHTML = 'visibility_off'
        } else {
          this.passwords.forEach(element => (element.type = 'password'))
          target.innerHTML = 'visibility'
        }
        this.isVisible = !this.isVisible
      }
      if (this.visibility) {
        this.visibility.addEventListener('click', (e) => toogleVisibility(e.target))
      } else {
        console.error('initToogleVisibility() Error: element with the attribut id \'visibility\' is required in form template.')
      }
      return this // chainable method
    }

    /**
    * Check Passwords
    */
    isPasswordsEquals () {
      return new Promise((resolve, reject) => {
        if (this.passwords.length !== 2) {
          console.error('isPasswordsEquals() Error: elements with class or \'password\' or \'confirm\' are required in form template.')
          const error = {
            success: false,
            msg: 'isPasswordsEquals() Error: elements with class or \'password\' or \'confirm\' are required in form template.'
          }
          return reject(error)
        }
        const [password, confirm] = [...this.passwords]
        if (password.value === confirm.value) return resolve(true)
        const error = {
          success: false,
          details: [
            {
              msg: 'Invalid passwords.',
              value: {
                password: password.value,
                confirm: confirm.value
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
    getFormData () {
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
    addOverlaySpinner () {
      const overlay = document.createElement('div')
      overlay.classList.add('overlay')
      this.form.appendChild(overlay)
      this.form.classList.add('action')
    }

    /**
    * Remove Overlay Spinner
    */
    removeOverlaySpinner () {
      const overlay = this.form.querySelector('.overlay')
      this.form.removeChild(overlay)
      this.form.classList.remove('action')
    }

    /**
    * Flash Message
    */
    display (response) {
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

  // Instanciate Form class
  const RegisterForm = new Form(form)
  // Init Underline Effect
  RegisterForm.initUnderline()
  // Init Toogle Visibility
  RegisterForm.initToogleVisibility()
  /**
  * Submit Event on form
  */
  form.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const validatePasswords = await RegisterForm.isPasswordsEquals()
      const formData = await RegisterForm.getFormData()
      if (validatePasswords) {
        const confirmationMsg = {
          username: formData.details[0].value.username,
          email: formData.details[0].value.email,
          password: formData.details[0].value.password
        }
        const msg = `Please confirm your registration:\n ${JSON.stringify(confirmationMsg, null, 2)}`
        // prompt confirmation
        if (!confirm(msg)) {
          console.log('confirmation aborted') // !DEBUG
        } else {
          RegisterForm.addOverlaySpinner()
          setTimeout(() => {
            RegisterForm.removeOverlaySpinner()
            console.log('confirmed') // !DEBUG
            RegisterForm.display(formData)
            // reset form
            console.log('form reset') // !DEBUG
            e.target.reset()
          }, 20000)
        }
      }
    } catch (error) {
      console.log('error case') // !DEBUG
      RegisterForm.display(error)
    }
  })
})()
