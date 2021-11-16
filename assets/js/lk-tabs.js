window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lk-tabs').forEach((tabs) => {
    const tabsContent = tabs.querySelectorAll(':scope > .lk-tabs__content')
    const tabsNav = tabs.querySelector(':scope > .lk-tabs__nav')
    const tabsRadio = tabsNav.querySelectorAll(':scope > .lk-tabs__radio')
    const mobSelect = tabs.querySelector(':scope > .lk-tabs__mobile-select')
    let hasChecked = false

    mobSelect.addEventListener('click', () => {
      mobSelect.classList.toggle('lk-tabs__mobile-select--mob-visible')
    })
    document.addEventListener('click', (e) => {
      if (mobSelect !== e.target && tabsNav !== e.target) {
        mobSelect.classList.remove('lk-tabs__mobile-select--mob-visible')
      }
    })

    const changeTabNav = function() {
      hasChecked = true
      this.checked = true
      tabsContent.forEach((content) => content.classList.remove('lk-tabs__content_active'))
      tabs.querySelector(`#${this.value}`).classList.add('lk-tabs__content_active')
      mobSelect.classList.remove('lk-tabs__mobile-select--mob-visible')
      mobSelect.textContent = this.nextElementSibling.textContent
    }
    tabsRadio.forEach((radio) => {
      radio.addEventListener('change', changeTabNav)
      if (radio.checked) changeTabNav.call(radio)
    })
    if (!hasChecked) changeTabNav.call(tabsRadio[0])
  })
})
