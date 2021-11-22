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

      if (optionPopup === 'service' || 'getConsultation') {
        const form = popup.querySelector('form')
        form.addEventListener('submit', (event) => {
          sendForm(event, form)
        })
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

  function getFormInputs(form) {
    const inputsValues = {}
    const formInputs = form.elements

    Object.entries(formInputs).forEach(([inputName, input]) => {
      inputsValues[inputName] = input.value
    })

    return inputsValues
  }

  function successAlert() {
    const successForm = document.querySelector('[data-popup=success]')
    if (successForm) {
      successForm.classList.add('lk-popup--active')
    }
  }

  async function requestFormApi(url, data = {}) {
    let result

    try {
      result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data)
      })
    } catch (e) {
      throw e
    }

    if (!result.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return result;
  }

  function sendForm(event, form) {
    event.preventDefault();

    const submitBtn = form.querySelector('input[type=submit]')
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const data = getFormInputs(form);

    submitBtn.disabled = true

    requestFormApi(url, data)
      .then(response => {
        closePopup()
        successAlert()
      }).catch(err => {
      console.error(err)
    }).finally(() => {
      submitBtn.disabled = false
    })
  }

  document.querySelectorAll('.lk-popup__phone-input').forEach((input) => {
    input.addEventListener('focus', (event) => {
      const parent = event.target.parentNode
      if (parent.classList.contains('lk-popup__phone-wrapper'))
        parent.classList.add('lk-popup__phone-wrapper--hover')
    })

    input.addEventListener('blur', (event) => {
      const parent = event.target.parentNode
      if (parent.classList.contains('lk-popup__phone-wrapper--hover'))
        parent.classList.remove('lk-popup__phone-wrapper--hover')
    })
  })
})