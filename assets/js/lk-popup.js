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
      const actionProperty = button.dataset.actionProperty
      const inputActionProperty = popup.querySelector('[data-action-property]')

      popup.classList.add('lk-popup--active')

      if (form) {
        form.addEventListener('submit', sendForm)

      }

      if (selectBlock) {
        selectValue ? selectBlock.value = selectValue : selectBlock.value = ''
      }

      if (inputTicketNumber) {
        inputTicketNumber.value = ticketNumber
      }

      if (actionProperty && inputActionProperty) {
        inputActionProperty.dataset.actionProperty = actionProperty
      }
    })
  })

  const closePopup = () => {
    const activePopup = document.querySelector('.lk-popup--active')
    const form = activePopup.querySelector('form')
    const labelEvaluations = activePopup.querySelectorAll('.lk-popup__evaluations-label')

    activePopup.classList.remove('lk-popup--active')

    if (!form) {
      return
    }
    const inputActionProperty = form.querySelector('[data-action-property]')


    form.reset()

    labelEvaluations.forEach(el => {
      if (el.classList.contains('lk-popup__evaluations-label--selected')) {
        el.classList.remove('lk-popup__evaluations-label--selected')
      }
    })

    if (inputActionProperty) {
      inputActionProperty.dataset.actionProperty = ''
    }
  }

  document.querySelectorAll('[data-js=popup-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', closePopup)
  })

  document.querySelectorAll('.lk-popup').forEach(el => {
    el.addEventListener('click', e => {
      const activeElement = document.activeElement;
      const inputs = ['input', 'select', 'button', 'textarea'];

      if (!e.target.classList.contains('lk-popup--active')) {
        return
      }

      if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
        return
      }

      closePopup()
    })
  })

  function successAlert() {
    openPopup('success')
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

  function sendAction(property) {
    property = JSON.parse(property);
    BX.Bizproc.doInlineTask(property, function(){window.location.reload()})
  }

  function sendForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('input[type=submit]')
    const url = 'local/components/bitrix/bizproc.task.list/ajax.php';
    const actionProperty = form.querySelector('[data-action-property]')

    submitBtn.disabled = true

    requestFormApi(url, form)
      .then(response => {
        if (actionProperty) {
          sendAction(actionProperty.dataset.actionProperty)
        }
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

const openPopup = (dataPopup) => {
  const popup = document.querySelector(`[data-popup="${dataPopup}"]`)
  if (popup) {
    popup.classList.add('lk-popup--active')
  }
}
