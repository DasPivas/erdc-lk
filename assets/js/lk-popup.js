window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lk-popup__evaluations-label').forEach(label => {
    label.addEventListener('click', (e) => {
      const target = e.target
      const popupForm = document.querySelector('.lk-popup--active')
      const evaluationsLabls = popupForm.querySelectorAll('.lk-popup__evaluations-label')
      let isPaint = true
  
      evaluationsLabls.forEach(innerLabel => {
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
      const inputTikcetNumber = popup.querySelector('.lk-popup__tiket-value')

      popup.classList.add('lk-popup--active')
      inputTikcetNumber.value = ticketNumber
    })
  })
  
  const removeAttr = (collection, option, value) => {
    switch (option) {
      case 'class':
        collection.forEach(el => {
          if (el.classList.contains(value)) {
            el.classList.remove(value)
          }
        })
        break;
      case 'checked':
        collection.forEach(el => {
          if (el.checked) {
            el.checked = value
          }
        })
        break;
      case 'value':
        collection.forEach(el => {
          el.value = ''
        })
        break;
    }
  }
  
  const closePopup = () => {
    const activeForm = document.querySelector('.lk-popup--active')
    const labelEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-label')
    const inputEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-input')
    const inputTiketNumber = activeForm.querySelectorAll('.lk-popup__tiket-value')
    const textareaComment = activeForm.querySelectorAll('.lk-popup__textarea')
  
    removeAttr(inputTiketNumber, 'value', '')
    removeAttr(textareaComment, 'value', '')
    removeAttr(labelEvaluations, 'class', 'lk-popup__evaluations-label--selected')
    removeAttr(inputEvaluations, 'checked', false)
  
    activeForm.classList.remove('lk-popup--active')
  }

  document.querySelectorAll('[data-js=popup-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', e => {
      closePopup()
    })
  })
  
  document.querySelectorAll('.lk-popup').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.classList.contains('lk-popup--active')) {
        closePopup()
      }
    })
  })
})