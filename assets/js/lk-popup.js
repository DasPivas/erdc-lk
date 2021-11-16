window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lk-popup__evaluations-label').forEach(label => {
    label.addEventListener('click', (e) => {
      const target = e.target
      const popupForm = document.querySelector('.lk-popup--active')
      const formLabls = popupForm.querySelectorAll('.lk-popup__evaluations-label')
      let isPaint = true

      formLabls.forEach(innerLabel => {
        if (innerLabel.classList.contains('lk-popup__evaluations-label--selected')) {
          innerLabel.classList.remove('lk-popup__evaluations-label--selected')
        }
        if (isPaint) {
          innerLabel.classList.add('lk-popup__evaluations-label--selected')
        }
        if (innerLabel === target) {
          isPaint = false
        }
      })
    })
  })

  document.querySelectorAll('[data-for-popup]').forEach(consultationBtn => {

    consultationBtn.addEventListener('click', e => {
      e.preventDefault()

      const optionPopup = consultationBtn.dataset.forPopup
      const ticketNumber = consultationBtn.dataset.tiketNumber
      const popup = document.querySelector(`[data-popup=${optionPopup}]`)

      popup.classList.add('lk-popup--active')
      popup.classList.add('show')
      console.log(optionPopup,ticketNumber)
    })
  })

  document.querySelectorAll('[data-js=popup-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', e => {
      const activeForm = document.querySelector('.lk-popup--active')

      activeForm.classList.remove('lk-popup--active')
    })
  })
})