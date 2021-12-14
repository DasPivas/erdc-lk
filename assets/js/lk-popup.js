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

    if (form.getAttribute('novalidate')) {
      clearFormError(form)
    }
  }

  const clearFormError = (form) => {
    const choiceErr = form.querySelectorAll('.choices__inner.error')
    const inputErr = form.querySelectorAll('.lk-popup__input.lk-popup__input--error')
    const inputPhoneErr = form.querySelectorAll('.lk-popup__input--error.lk-popup__phone')
    const btnDisabled = form.querySelector('button[disabled]')

    if (choiceErr) {
      removeClassList(choiceErr, 'error')
      const inputErrBlock = form.querySelectorAll('.input--error')
      if (inputPhoneErr) {
        removeNode(inputErrBlock)
      }
    }
    if (inputPhoneErr) {
      removeClassList(inputPhoneErr, 'lk-popup__input--error')
    }
    if (inputErr) {
      removeClassList(inputErr, 'lk-popup__input--error')
      const phoneErrBlock = form.querySelectorAll('.lk-popup__input--error')
      if (phoneErrBlock) {
        removeNode(phoneErrBlock)
      }
    }
    if (btnDisabled) {
      btnDisabled.disabled = false
    }
  }

  const removeClassList = (collection, className) => {
    collection.forEach((el) => {
      el.classList.remove(className)
    })
  }

  const removeNode = (collection) => {
    collection.forEach((el) => {
      el.remove()
    })
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
    BX.Bizproc.doInlineTask(property, function () {
      window.location.reload()
    })
  }

  function sendForm(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type=submit]');
    const url = '/recruitment/ajax.php';
    // const url = 'http://lk.erdc.kistin.sitesoft.ru/recruitment/ajax.php';
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

  document.querySelectorAll('[data-for-popup]').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      const popupType = button.dataset.forPopup;
      const ticketNumber = button.dataset.tiketNumber;
      const popup = document.querySelector(`[data-popup=${popupType}]`);
      const form = popup.querySelector('form');
      const inputTicketNumber = popup.querySelector('.lk-popup__tiket-value');
      const actionProperty = button.dataset.actionProperty;
      const inputActionProperty = popup.querySelector('[data-action-property]');
      const selectService = form.querySelector('[data-js=select]');
      const selectValue = button.dataset.selectValue;

      openPopup(popupType)

      if (selectService) {
        if (!window.choicesInstance) {
          window.choicesInstance = new Choices(selectService, {
              searchChoices: false,
              searchEnabled: false,
              itemSelectText: '',
              shouldSort: false
            }
          );
        }
        if (selectValue) {
          window.choicesInstance.setChoiceByValue(selectValue);
        } else window.choicesInstance.setChoiceByValue('');
      }

      if (inputTicketNumber) {
        inputTicketNumber.value = ticketNumber
      }

      if (actionProperty && inputActionProperty) {
        inputActionProperty.dataset.actionProperty = actionProperty
      }

    });
  });

  $.validator.setDefaults({ignore: ":hidden:not(select)"});

  $.validator.addMethod("phonemask", function (value) {
    return value.replace(/\D+/g, '').length > 9;
  });

  const validateOption = {
    errorElement: 'div',
    errorClass: 'lk-popup__input--error',
    errorPlacement: function (error, element) {
      if (element.data("js") == "select") {
        $(".input--error").html(error);
      } else {
        element.parent().append(error)
      }
    },
    highlight: function (element) {
      if (element.getAttribute('data-js') === 'select') {
        $('.choices__inner').addClass('error');
      } else {
        element.classList.add('lk-popup__input--error')
      }
    },
    unhighlight: function (element) {
      if (element.getAttribute('data-js') === 'select') {
        $('.choices__inner').removeClass('error');
      } else {
        element.classList.remove('lk-popup__input--error')
      }
    },
    rules: {
      select: {
        required: true
      },
      name: {
        required: true,
        minlength: 3
      },
      email: {
        required: true,
        minlength: 6
      },
      phone: {
        required: true,
        phonemask: true,
        minlength: 10
      }
    },
    messages: {
      name: {
        required: "Поле обязательно к заполнению",
        minlength: "Введите мин. 3 символа"
      },
      email: {
        required: "Поле обязательно к заполнению",
        email: "Введите корректный e-mail адрес"
      },
      phone: {
        required: "Поле обязательно к заполнению",
        phonemask: "Введите телефон"
      },
      select: {
        required: "Поле обязательно к заполнению"
      },
    },

    submitHandler: function (form, event) {
      sendForm(event)
    },

    invalidHandler: function (event, validator) {
      $(this).find('input[type=submit], button[type=submit]').prop('disabled', true);
    },
  }

  $('form').on('click', 'button[type="submit"]', function (e) {
    let $forms = $(this).closest('form');

    $($forms).validate(validateOption);

    $('[data-js="select"]').change(function () {
      if (true) {
        $('[data-js="select"]').valid();
      }
    });
  });

  $('[data-popup=service] input[required], [data-popup=service] select[required]').bind('keyup blur click change', function () { // fires on every keyup & blur
    const form = $('[data-popup=service] form')
    const submitBtn = form.find('input[type=submit], button[type=submit]')

    if (form.validate(validateOption).checkForm()) {                   // checks form for validity
      submitBtn.removeClass('button_disabled').prop('disabled', false); // enables button
    } else {
      submitBtn.addClass('button_disabled').prop('disabled', true);   // disables button
    }
  });

  $('input[type="tel"]').inputmask("(999) 999-99-99");

  const openPopup = (dataPopup) => {
    const popup = document.querySelector(`[data-popup="${dataPopup}"]`)
    if (popup) {
      popup.classList.add('lk-popup--active')
    }
  }
});
