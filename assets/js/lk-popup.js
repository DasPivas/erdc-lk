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
      const selectValue = consultationBtn.dataset.selectValue
      const popup = document.querySelector(`[data-popup=${optionPopup}]`)
      const inputTikcetNumber = popup.querySelector('.lk-popup__tiket-value')
      const selectBlock = popup.querySelector('.lk-popup__service-select')

      if (selectBlock) {
        selectValue ? selectBlock.value = selectValue : selectBlock.value = ''
      }
      popup.classList.add('lk-popup--active')
      if (inputTikcetNumber) {
        inputTikcetNumber.value = ticketNumber
      }
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
    const inputTiketNumber = activeForm.querySelectorAll('.lk-popup__tiket-value')
    const inputName = activeForm.querySelectorAll('.lk-popup__name-input')
    const inputPhone = activeForm.querySelectorAll('.lk-popup__phone-input')
    const inputEmail = activeForm.querySelectorAll('.lk-popup__email-input')
    const textareaComment = activeForm.querySelectorAll('.lk-popup__textarea')
    const labelEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-label')
    const inputEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-input')
  
    removeAttr(inputTiketNumber, 'value', '')
    removeAttr(inputName, 'value', '')
    removeAttr(inputPhone, 'value', '')
    removeAttr(inputEmail, 'value', '')
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

  function getFormInputs (event) {
    const inputsValues = {}
    const formInputs = event.target.elements

    Object.entries(formInputs).forEach(([inputName, input]) => {
      inputsValues[inputName] = input.value
    })

    return inputsValues
  }

  window.alertSuccess = (arguments) => {
    const event = arguments[0]
    event.preventDefault()

    const inputsValues = getFormInputs(event)

    console.log(inputsValues)
    return

    closePopup()

    const successForm = document.querySelector('[data-popup=success]')
    console.log(successForm)
    if (successForm) {
      successForm.classList.add('lk-popup--active')
    }
    form.submit()
  }
})