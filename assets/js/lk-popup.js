window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lk-popup__evaluations-label').forEach(label => {
    label.addEventListener('click', (e) => {
      const target = e.target
      const popupForm = target.closest('form')
      const formLabls = popupForm.querySelectorAll('.lk-popup__evaluations-label')

      formLabls.forEach(innerLabel => {
        console.log('5555', innerLabel)
        if (innerLabel.classList.contains('lk-popup__evaluations-input--selected')) {
          innerLabel.classList.remove('lk-popup__evaluations-input--selected')
        }
      })

      target.classList.add('lk-popup__evaluations-input--selected')
      console.log(target)
    })
  })

})