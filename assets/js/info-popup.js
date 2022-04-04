function infoPopupOpen(param) {
  if (!param) return

  const popuptType = param.type || 'SUCCESS'

  const infoPopup = document.createElement('div')
  infoPopup.classList.add('info-popup')

  const infoPopupWrapper = document.createElement('div')
  infoPopupWrapper.classList.add('info-popup__wrapper')

  const infoPopupIconWrapper = document.createElement('div')
  infoPopupIconWrapper.classList.add('info-popup__icon-wrapper')

  const infoPopupContent = document.createElement('div')
  infoPopupContent.classList.add('info-popup__content')

  if (param.title) {
    const infoPopupTitle = document.createElement('div')
    infoPopupTitle.classList.add('info-popup__title')
    infoPopupTitle.innerHTML = param.title
    infoPopupContent.appendChild(infoPopupTitle)
  }

  if (param.message) {
    const infoPopupMassage = document.createElement('div')
    infoPopupMassage.classList.add('info-popup__massage')
    infoPopupMassage.innerHTML = param.message
    infoPopupContent.appendChild(infoPopupMassage)
  }

  const infoPopupLink = document.createElement('a')
  infoPopupLink.classList.add('info-popup__link')
  infoPopupLink.innerHTML = param.linkTitle || 'На главную страницу'
  infoPopupLink.setAttribute('href', param.linkHref || '/')
  infoPopupContent.appendChild(infoPopupLink)

  const infoPopupCloseBtn = document.createElement('div')
  infoPopupCloseBtn.classList.add('info-popup__close')
  infoPopupCloseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path d="M5.29289 6.70711L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711Z" fill="#A7A7AB"/>\n' +
    '<path d="M17.2929 5.29289L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289Z" fill="#A7A7AB"/>\n' +
    '</svg>'
  infoPopupContent.appendChild(infoPopupCloseBtn)

  switch (popuptType) {
    case 'SUCCESS':
      infoPopupIconWrapper.innerHTML = '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#F6EDF2"/>\n' +
        '<path d="M44 32C44 38.6275 38.6275 44 32 44C25.3726 44 20 38.6275 20 32C20 25.3726 25.3726 20 32 20C33.9823 20 35.8524 20.4807 37.5 21.3318" stroke="black" stroke-width="2" stroke-linecap="round"/>\n' +
        '<path d="M26 30L30.1144 34.1144C31.1557 35.1557 32.8443 35.1557 33.8856 34.1144L42 26" stroke="black" stroke-width="2" stroke-linecap="round"/>\n' +
        '</svg>\n'
      break
  }

  infoPopupWrapper.appendChild(infoPopupIconWrapper)
  infoPopupWrapper.appendChild(infoPopupContent)
  infoPopup.appendChild(infoPopupWrapper)
  document.body.appendChild(infoPopup)

  infoPopupCloseBtn.addEventListener('click', function () {
    infoPopup.remove()
  })

  infoPopup.addEventListener('click', function (event) {
    if (event.target.classList.contains('info-popup')) {
      infoPopup.remove()
    }
  })
}
