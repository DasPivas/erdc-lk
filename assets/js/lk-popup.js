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
    const submitBtn = form.querySelector('input[type=submit]');
    const url = '/recruitment/ajax.php';
    const actionProperty = form.querySelector('[data-action-property]');

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

  const element = document.querySelectorAll('.lk-popup__select');
  element.forEach(item => {
    const sel = new Choices(item, {
      searchChoices: false,
      searchEnabled: false,
      itemSelectText:'',
      shouldSort: false
    });

    // const selectValue = button.dataset.value;
    // sel.setChoiceByValue(selectValue);

    item.addEventListener('addItem',
    function(event) {
      if (event.detail.value < 1) {
        this.closest('.choices__inner').classList.add('error');
      }else {
        this.closest('.choices__inner').classList.remove('error');
      }
      
      },false);
    });

  



document.querySelectorAll('[data-for-popup]').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    
    const popupType = button.dataset.forPopup;
    const ticketNumber = button.dataset.tiketNumber;
    const popup = document.querySelector(`[data-popup=${popupType}]`);
    const form = popup.querySelector('form');
    const inputTicketNumber = popup.querySelector('.lk-popup__tiket-value');
    const selectBlock = popup.querySelector('.lk-popup__service-select');
    const actionProperty = button.dataset.actionProperty;
    const inputActionProperty = popup.querySelector('[data-action-property]');

    const example = document.querySelector('.lk-popup__select');
    const selectValue = button.dataset.value;
    
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

$('.lk-popup__form').validate({
  errorElement: 'div',
  errorClass: 'lk-popup__input--error',
    rules: {
      name: {
          required: true,
          minlength: 3
      },
      email: {
          required: true,
          minlength: 6
      }
    },
    messages: {
      email: {
          required: "Введите email",
          email: "Не валидный email"
      },
      name: {
          required: "Введите имя",
          minlength: "мин. 3 символа"
      }
  },
});
$('input[type="tel"]').inputmask("(999) 999-99-99",{ "clearIncomplete": true, showMaskOnHover: false });

const openPopup = (dataPopup) => {
  const popup = document.querySelector(`[data-popup="${dataPopup}"]`)
  if (popup) {
    popup.classList.add('lk-popup--active')
  }
}

});
