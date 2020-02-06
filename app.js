(() => {
  /**
  * Toogle Visibility 
  */
  let isVisibility = false
  const toogleVisibility = target => {
    const passwordInputs = [...document.querySelectorAll('#resgistration_form .password')]
    if (!isVisibility) {
      passwordInputs.forEach(element => element.type = 'text')
      target.innerHTML = 'visibility_off'
    } else {
      passwordInputs.forEach(element => element.type = 'password')
      target.innerHTML = 'visibility'
    }
    isVisibility = !isVisibility
  }
  /**
  * Vibility Event 
  */
  document.querySelector('#visibility').addEventListener('click', e => toogleVisibility(e.target))
  /**
  * Inputs Underline Effect on Focus Events 
  */
  // Add/Remove class according event type
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
  const underlinedElements = [...document.querySelectorAll('#resgistration_form .underline')]
  underlinedElements.forEach(underline => {
      underline.children[0].addEventListener('focus', (e) => focusEvents(e.target.parentElement, 'focus'))
      underline.children[0].addEventListener('focusout',(e) => focusEvents(e.target.parentElement, 'focusout'))
  })
})()
