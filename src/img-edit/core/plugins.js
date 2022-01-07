class Plugin {
  constructor(name, iconHtml) {
    this.name = name
    this.iconHtml = iconHtml
    this.initDom()
    this.createConfDom()
  }
  initDom() {
    this.dom = document.createElement('div')
    this.dom.classList.add('plugin-item')
    this.dom.innerHTML = `${this.iconHtml}`
    this.dom.addEventListener('mousedown', event => {
      this._active()
    })
  }
  createConfDom() {
    this.confDom = document.createElement('div')
    this.confDom.classList.add('plugin-conf')
  }
  _active() {

  }
}

class SelectPlugin extends Plugin {
  constructor(name, iconHtml) {
    super(name, iconHtml)
    this.confDom.innerHTML = `<span>测试</span>`
  }
}

export default Plugin
export { Plugin, SelectPlugin }
