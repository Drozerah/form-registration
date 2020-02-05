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
  document.querySelector('#visibility')
    .addEventListener('click', (e) => {
      toogleVisibility(e.target)
    }
  )
})()