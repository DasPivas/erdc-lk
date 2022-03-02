;

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const setState = (popup, number) => {
    popup.setAttribute('data-progress', number.toString())
}

async function getFormApi(url) {
    let response, result
    try {
        response = await fetch(url, {
            method: 'GET',
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

const closePopup = (popup) => {
    popup.remove()
    document.cookie = "BITRIX_SM_SurveyModal=false";
}

const switchStatePopup = (popup) => {
    const valueFirstInput = popup.querySelector('[data-state="1"] input:checked')
    return valueFirstInput.dataset.valid ? 0 : 1
}

async function requestFormApi(url, data) {
    let response, result
    try {
        response = await fetch(url, {
            method: 'POST',
            body: {
                formId: 'id',
                formData: new FormData(data)
            }
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


window.addEventListener('DOMContentLoaded', () => {
    // document.cookie = "BITRIX_SM_SurveyModal=true";

    const isOpenSanctionsPopup = getCookie('BITRIX_SM_SurveyModal') === 'true' ? true : false

    if (isOpenSanctionsPopup) return

    //Создание попапа
    let statePopup = 1;

    const popup = document.createElement('div')
    const popupHead = '<div class="sanction-popup__wrapper"><button class="sanction-popup__close" data-js="popup-close"></button>'

    // Получение формы
    let formFromServer
    const urlForForm = ''

    popup.classList.add('sanction-popup', 'sanction-popup--active')
    popup.setAttribute('data-popup', 'sanctions')
    setState(popup, statePopup)

    zumba();

    async function zumba() {
        const formFromServer = await getFormApi(urlForForm);

        console.log(formFromServer)

        popup.innerHTML = popupHead + formFromServer + '</div>'
        document.body.appendChild(popup)

        //Логика попапа
        const form = popup.querySelector('form')
        const closeBtn = popup.querySelector('[data-js=popup-close]')
        const skipBtn = popup.querySelector('[data-js=skip-popup]')

        closeBtn.addEventListener('click', () => closePopup(popup))
        skipBtn.addEventListener('click', () => closePopup(popup))

        form.addEventListener('submit', sendForm)

        //Обработка скрытых обязательных полей
        const fieldsRequiredSecondState = form.querySelectorAll('[data-state="2"] input:required')

        fieldsRequiredSecondState.forEach(el => {
            el.required = false;
        })

        const setRequiredSecondState = () => {
            fieldsRequiredSecondState.forEach(el => {
              el.required = true
            })
        }

        async function sendForm(event) {
            event.preventDefault();

            const submitBtn = form.querySelector('input[type=submit]')
            const url = '/recruitment/ajax.php';
            console.log('send')

            switch (statePopup) {
              case 1:
                if (switchStatePopup(popup)) {
                  submitBtn.disabled = true
                  console.log('send1')

                  try {
                    await requestFormApi(url, form);
                    // statePopup++;
                  } catch (e) {
                    alert('Отправка не удалась!')
                    console.error(e)
                  } finally {
                    submitBtn.disabled = false
                    closePopup(popup)
                  }

                  break;
                }
                console.log('next1')
                statePopup++
                setState(popup, statePopup)
                setRequiredSecondState()
                break
              case 2:
                submitBtn.disabled = true
                console.log('send2')
                requestFormApi(url, form)
                    .then(response => {
                      statePopup++
                    }).catch(err => {
                  alert('Отправка не удалась!')
                  console.error(err)
                }).finally(() => {
                  submitBtn.disabled = false
                })
                break
            }
        }
    }
})
//


const test = '                    <form class="sanction-popup__form" id="123456789">\n' +
    '                      <div class="sanction-popup__tab" data-state="1">\n' +
    '                        <div class="sanction-popup__header">\n' +
    '                          <h3 class="sanction-popup__title"></h3>Влияют ли вводимые международные санкции и ограничения на реализацию Вашего проекта?\n' +
    '                        </div>\n' +
    '                        <div class="sanction-popup__body">\n' +
    '                          <div class="sanction-popup__radio-title">Какие риски вы ожидаете?</div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <label class="sanction-popup__label sanction-popup__label--radio">Оказывают критическое влияние (проект не будет реализован)\n' +
    '                              <input class="sanction-popup__radio" type="radio" name="sanction-importance" value="1" required="required" data-valid="true">\n' +
    '                              <div class="sanction-popup__radio-mark"></div>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <label class="sanction-popup__label sanction-popup__label--radio">Оказывают высокое негативное влияние (возможна приостановка проекта)\n' +
    '                              <input class="sanction-popup__radio" type="radio" name="sanction-importance" value="2" data-valid="true">\n' +
    '                              <div class="sanction-popup__radio-mark"></div>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <label class="sanction-popup__label sanction-popup__label--radio">Оказывают средне негативное влияние (проект будет реализован, но могут быть изменены параметры и сроки)\n' +
    '                              <input class="sanction-popup__radio" type="radio" name="sanction-importance" value="3" data-valid="true">\n' +
    '                              <div class="sanction-popup__radio-mark"></div>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <label class="sanction-popup__label sanction-popup__label--radio">Не оказывают влияние\n' +
    '                              <input class="sanction-popup__radio" type="radio" name="sanction-importance" value="4">\n' +
    '                              <div class="sanction-popup__radio-mark"></div>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <label class="sanction-popup__label sanction-popup__label--radio">Не оценивал риски\n' +
    '                              <input class="sanction-popup__radio" type="radio" name="sanction-importance" value="5">\n' +
    '                              <div class="sanction-popup__radio-mark"></div>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                        </div>\n' +
    '                      </div>\n' +
    '                      <div class="sanction-popup__tab" data-state="2">\n' +
    '                        <div class="sanction-popup__header">\n' +
    '                          <h3 class="sanction-popup__title"></h3>Ответьте на вопросы о рисках\n' +
    '                        </div>\n' +
    '                        <div class="sanction-popup__body"><div class="sanction-popup__block"><div class="sanction-popup__alert">' +
    '                            <div class="sanction-popup__alert-title">Влияние рисков</div>\n' +
    '                            <div class="sanction-popup__alert-desc">Оцените уровень влияния отдельных санкционных рисков на Ваш проект по 5-бальной шкале (5 - критически влияют на реализацию проекта, 1 - не влияют на реализацию проекта)</div>\n' +
    '                          </div></div>' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">1. Валютные риски (повышение обменного курса иностранных валют, трудности с переводом средств за рубеж и из-за рубежа)<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="currency-risks" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="currency-risks" value="2" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="currency-risks" value="3">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="currency-risks" value="4">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="currency-risks" value="5">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">2. Ограничения на привлечение иностранных специалистов/подрядчиков<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="foreign-specialists" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="foreign-specialists" value="2">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="foreign-specialists" value="3">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="foreign-specialists" value="4">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="foreign-specialists" value="5">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">3. Логистические риски (увеличение сроков или запрет на поставки товаров/услуг)<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="logistic-risks" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="logistic-risks" value="2" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="logistic-risks" value="3" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="logistic-risks" value="4" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="logistic-risks" value="5" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">4. Рост цен на сырье, строительные материалы, оборудование, услуги<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="price-risks" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="price-risks" value="2" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="price-risks" value="3" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="price-risks" value="4" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="price-risks" value="5" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">5. Ограничение заемного финансирования (в т.ч. рост процентных ставок)<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="funding-restrictions" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="funding-restrictions" value="2">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="funding-restrictions" value="3">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="funding-restrictions" value="4">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="funding-restrictions" value="5">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">6. Проблемы с действующими инвесторами или привлечением новых<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="problems-with-investors" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="problems-with-investors" value="2" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="problems-with-investors" value="3" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="problems-with-investors" value="4" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="problems-with-investors" value="5" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">7. Ограничения экспорта продукции<span class="sanction-popup--required">*</span></div>\n' +
    '                            <div class="sanction-popup__radio-section"><span class="sanction-popup__radio-info">Не влияет</span>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">1\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="export-restrictions" value="1" required="required">\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">2\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="export-restrictions" value="2" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">3\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="export-restrictions" value="3" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">4\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="export-restrictions" value="4" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label>\n' +
    '                              <label class="sanction-popup__label sanction-popup__label--radio-section">5\n' +
    '                                <input class="sanction-popup__radio" type="radio" name="export-restrictions" value="5" >\n' +
    '                                <div class="sanction-popup__radio-mark"></div>\n' +
    '                              </label><span class="sanction-popup__radio-info">Влияет</span>\n' +
    '                            </div>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">8. Назовите 3 ключевые меры поддержки, которые вы бы хотели получить в рамках снижения влияния санкционных рисков?</div>\n' +
    '                            <label class="sanction-popup__label">\n' +
    '                              <textarea class="sanction-popup__textarea" name="support-measures" rows="3" placeholder="Мой ответ" maxlength="4000"></textarea>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                          <div class="sanction-popup__block">\n' +
    '                            <div class="sanction-popup__radio-title">9. Ваш комментарий по санкционным рискам и возможным мерам поддержки</div>\n' +
    '                            <label class="sanction-popup__label">\n' +
    '                              <textarea class="sanction-popup__textarea" name="comments" rows="3" placeholder="Мой ответ" maxlength="4000"></textarea>\n' +
    '                            </label>\n' +
    '                          </div>\n' +
    '                        </div>\n' +
    '                      </div>\n' +
    '                      <div class="sanction-popup__tab" data-state="3">\n' +
    '                        <div class="sanction-popup__header">\n' +
    '                          <h3 class="sanction-popup__title"></h3>Анкета успешно отправлена\n' +
    '                        </div>\n' +
    '                      </div>\n' +
    '                      <div class="sanction-popup__footer">\n' +
    '                        <div class="sanction-popup__btns"><a class="sanction-popup__skip" href="#" data-js="skip-popup">Пройти позже</a>\n' +
    '                          <input class="sanction-popup__btn" type="submit" value="Отправить">\n' +
    '                        </div>\n' +
    '                      </div>\n' +
    '                    </form>\n' +
    '                  '