function infoPopupOpen(param) {
  if (!param) return

  const popupType = param.type || 'SUCCESS'

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
  infoPopupLink.innerHTML = param.linkTitle || 'To the main page'
  infoPopupLink.setAttribute('href', param.linkHref || '/')
  infoPopupContent.appendChild(infoPopupLink)

  const infoPopupCloseBtn = document.createElement('div')
  infoPopupCloseBtn.classList.add('info-popup__close')
  infoPopupCloseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path d="M5.29289 6.70711L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711Z" fill="#A7A7AB"/>\n' +
    '<path d="M17.2929 5.29289L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289Z" fill="#A7A7AB"/>\n' +
    '</svg>'
  infoPopupContent.appendChild(infoPopupCloseBtn)

  switch (popupType) {
    case 'SUCCESS':
      infoPopupIconWrapper.innerHTML = '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#F6EDF2"/>\n' +
        '<path d="M44 32C44 38.6275 38.6275 44 32 44C25.3726 44 20 38.6275 20 32C20 25.3726 25.3726 20 32 20C33.9823 20 35.8524 20.4807 37.5 21.3318" stroke="black" stroke-width="2" stroke-linecap="round"/>\n' +
        '<path d="M26 30L30.1144 34.1144C31.1557 35.1557 32.8443 35.1557 33.8856 34.1144L42 26" stroke="black" stroke-width="2" stroke-linecap="round"/>\n' +
        '</svg>'
      break
    case 'ERROR':
      infoPopupIconWrapper.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<rect width="63.1716" height="63.1716" rx="31.5858" fill="#D51A1A" fill-opacity="0.08"/>\n' +
        '<path d="M30.8787 16.2929C31.2692 15.9024 31.9024 15.9024 32.2929 16.2929L46.8787 30.8787C47.2692 31.2692 47.2692 31.9024 46.8787 32.2929L32.2929 46.8787C31.9024 47.2692 31.2692 47.2692 30.8787 46.8787L16.2929 32.2929C15.9024 31.9024 15.9024 31.2692 16.2929 30.8787L30.8787 16.2929Z" fill="#D51A1A"/>\n' +
        '<path d="M30.0859 35.5857H33.0859V38.5857H30.0859V35.5857Z" fill="white"/>\n' +
        '<path d="M30.0859 23.5857H33.0859V32.5857H30.0859V23.5857Z" fill="white"/>\n' +
        '</svg>'
      break
    case 'INFO':
      infoPopupIconWrapper.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<rect width="64" height="64" rx="32" fill="#2D55B2" fill-opacity="0.08"/>\n' +
        '<circle cx="32" cy="32" r="16" fill="#2D55B2"/>\n' +
        '<path d="M30.1543 23.3846H33.8466V27.0769H30.1543V23.3846Z" fill="white"/>\n' +
        '<path d="M30.1543 30.7692H33.8466V40.6154H30.1543V30.7692Z" fill="white"/>\n' +
        '</svg>'
      break
    case 'WARNING':
      infoPopupIconWrapper.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<rect width="64" height="64" rx="32" fill="#FF9500" fill-opacity="0.08"/>\n' +
        '<path d="M31.1415 20.4408C31.5294 19.7902 32.4716 19.7902 32.8594 20.4408L47.0986 44.3267C47.496 44.9932 47.0157 45.8387 46.2397 45.8387H17.7604C16.9844 45.8387 16.5041 44.9932 16.9015 44.3266L31.1415 20.4408Z" fill="#FF9500"/>\n' +
        '<path d="M30.4512 39.6452H33.5479V42.7419H30.4512V39.6452Z" fill="white"/>\n' +
        '<path d="M30.4512 27.2581H33.5479V36.5484H30.4512V27.2581Z" fill="white"/>\n' +
        '</svg>'
      break
  }

  infoPopupWrapper.appendChild(infoPopupIconWrapper)
  infoPopupWrapper.appendChild(infoPopupContent)
  infoPopup.appendChild(infoPopupWrapper)
  document.body.appendChild(infoPopup)

  const closeInfoPopup = function () {
    infoPopup.remove()

    if (!param.afterClose) return

    param.afterClose()
  }

  infoPopupCloseBtn.addEventListener('click', function () {
    closeInfoPopup()
  })

  document.addEventListener('keydown', function closePopupOnEsc(event) {
    if (event.key === 'Escape') {
      closeInfoPopup()
      this.removeEventListener('keydown', closePopupOnEsc);
    }
  });

  infoPopup.addEventListener('click', function (event) {
    if (event.target.classList.contains('info-popup')) {
      closeInfoPopup()
    }
  })
}
