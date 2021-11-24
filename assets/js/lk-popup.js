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

  document.querySelectorAll('[data-for-popup]').forEach(button => {

    button.addEventListener('click', e => {
      e.preventDefault()

      const popupType = button.dataset.forPopup
      const ticketNumber = button.dataset.tiketNumber
      const selectValue = button.dataset.selectValue
      const popup = document.querySelector(`[data-popup=${popupType}]`)
      const form = popup.querySelector('form')
      const inputTicketNumber = popup.querySelector('.lk-popup__tiket-value')
      const selectBlock = popup.querySelector('.lk-popup__service-select')

      popup.classList.add('lk-popup--active')

      if (popupType === 'service' || popupType === 'getConsultation') {
        form.addEventListener('submit', sendForm)
      }

      if (selectBlock) {
        selectValue ? selectBlock.value = selectValue : selectBlock.value = ''
      }

      if (inputTicketNumber) {
        inputTicketNumber.value = ticketNumber
      }
    })
  })

  const closePopup = () => {
    const activeForm = document.querySelector('.lk-popup--active')
    const form = activeForm.querySelector('form')
    const labelEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-label')

    activeForm.classList.remove('lk-popup--active')

    if (!form) {
      return
    }

    form.reset()

    labelEvaluations.forEach(el => {
      if (el.classList.contains('lk-popup__evaluations-label--selected')) {
        el.classList.remove('lk-popup__evaluations-label--selected')
      }
    })
  }

  document.querySelectorAll('[data-js=popup-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', closePopup)
  })

  document.querySelectorAll('.lk-popup').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.classList.contains('lk-popup--active')) {
        closePopup()
      }
    })
  })

  function successAlert() {
    const successForm = document.querySelector('[data-popup=success]')
    if (successForm) {
      successForm.classList.add('lk-popup--active')
    }
  }

  async function requestFormApi(url, data) {
    let response, result

    try {
      response = await fetch(url, {
        method: 'POST',
        body: new FormData(data)
      })
      result = await response.json()
    } catch (e) {
      throw e
    }

    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    return result;
  }

  function sendForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('input[type=submit]')
    const url = '/recruitment/ajax.php';

    submitBtn.disabled = true

    requestFormApi(url, form)
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