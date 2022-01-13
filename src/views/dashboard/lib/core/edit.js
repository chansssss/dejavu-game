import Workbench from './workbench'
import ObjectManage from './object-manage'
class Editor {
    #dom
    #workbench
    #objectManage
    #options
    constructor(dom, options) {
      if (dom instanceof HTMLElement) {
        this.#dom = dom
      } else {
        this.#dom = document.getElementById(dom)
      }
      this.#options = options
      this.initDom()
      this.initWorkbench()
      this.initObjectManage()
    }
    // 初始化ui
    initDom() {
      this.#dom.innerHTML = `
        <div class='dajevu-container'>
          <div class='dajevu-header'></div>
          <div class='dajevu-main'>
            <div class='dajevu-left'></div>
            <div class='dajevu-center'></div>
            <div class='dajevu-right'></div>
          </div>
        </div>
      `
      this.headerDom = this.#dom.querySelector('.dajevu-header')
      this.leftDom = this.#dom.querySelector('.dajevu-left')
      this.centerDom = this.#dom.querySelector('.dajevu-center')
      this.rightDom = this.#dom.querySelector('.dajevu-right')
    }
    // 初始化画布
    initWorkbench() {
      this.#workbench = new Workbench(this, this.centerDom.offsetWidth, this.centerDom.offsetHeight)
      this.centerDom.appendChild(this.#workbench.canvas)
    }
    // 初始化素材管理器
    initObjectManage() {
      this.#objectManage = new ObjectManage()
      this.rightDom.appendChild(this.#objectManage.dom)
    }
    // 初始化网格对象编辑器
    initEditor() {
    }
}

export default Editor
