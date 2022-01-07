import { SelectPlugin } from './plugins'
import { Workbench } from './workbench'
import { Layer } from './layer'

// edit core
class DajevuImageEdit {
  constructor(dom, options = {}) {
    // 根元素
    if (dom instanceof HTMLElement) {
      this.dom = dom
    } else {
      this.dom = document.getElementById(dom)
    }
    // 配置
    this.options = Object.assign({
      width: 500, // 编辑器宽度
      height: 500 // 编辑器高度
    }, options)

    // 已安装的插件
    this.installedPlugins = []
    this.activedPlugin = null
    this.activedPluginIndex = -1

    // 图层
    this.layers = []

    this.initDom()
    this.initPlugin()
    this.initWorkBench()
  }

  initDom() {
    this.dom.style.width = this.options.width + 'px'
    this.dom.style.height = this.options.height + 'px'
    this.dom.innerHTML = `
      <div class='dajevu-container'>
        <div class='dajevu-tools-bar'></div>
        <div class='dajevu-main'>
          <div class='dajevu-plugins'></div>
          <div class='dajevu-workbench'></div>
          <div class='dajevu-layers'></div>
        </div>
      </div>
    `
    this.toolBarDom = this.dom.querySelector('.dajevu-tools-bar')
    this.pluginsDom = this.dom.querySelector('.dajevu-plugins')
    this.workbenchDom = this.dom.querySelector('.dajevu-workbench')
    this.layersDom = this.dom.querySelector('.dajevu-layers')
  }

  // 安装插件
  installPlugin(plugin) {
    this.installedPlugins.push(plugin)
    this.pluginsDom.appendChild(plugin.dom)
    this.toolBarDom.appendChild(plugin.confDom)
    plugin._active = function() {
      this.activePlugin(plugin)
    }
    plugin._active = plugin._active.bind(this)
  }

  // 激活插件
  activePlugin(plugin) {
    if (this.activedPlugin) {
      this.activedPlugin.dom.classList.remove('active')
      this.activedPlugin.confDom.classList.remove('active')
    }
    this.activedPlugin = plugin
    this.activedPlugin.dom.classList.add('active')
    this.activedPlugin.confDom.classList.add('active')
  }

  // 初始化默认插件
  initPlugin() {
    const p = new SelectPlugin('select', '<svg t="1641527243340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1921" width="200" height="200"><path d="M581.12 886.826667a74.026667 74.026667 0 0 1-16.64-2.133334 64 64 0 0 1-38.826667-29.866666l-106.666666-185.813334-120.96 181.76-4.266667 2.346667a69.76 69.76 0 0 1-104.533333-60.373333V206.933333a69.76 69.76 0 0 1 104.533333-60.373333L800.426667 439.466667a69.546667 69.546667 0 0 1 0 120.746666l-4.266667 2.56-233.386667 14.933334 110.72 192a64 64 0 0 1-23.466666 87.466666l-36.906667 21.333334a65.92 65.92 0 0 1-32 8.32z m-160.213333-298.666667l141.653333 245.12a21.333333 21.333333 0 0 0 13.013333 9.813333 20.053333 20.053333 0 0 0 16-2.133333l37.12-21.333333a21.333333 21.333333 0 0 0 9.813334-12.8 21.333333 21.333333 0 0 0-2.133334-16.213334L490.666667 539.52l291.413333-18.773333a26.666667 26.666667 0 0 0-3.626667-44.16L271.786667 183.68a27.093333 27.093333 0 0 0-40.533334 23.253333v585.813334a26.666667 26.666667 0 0 0 13.653334 23.466666 26.453333 26.453333 0 0 0 23.04 1.92z" p-id="1922" fill="#ffffff"></path></svg>')
    this.installPlugin(p)
    const p1 = new SelectPlugin('select1', '<svg t="1641527243340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1921" width="200" height="200"><path d="M581.12 886.826667a74.026667 74.026667 0 0 1-16.64-2.133334 64 64 0 0 1-38.826667-29.866666l-106.666666-185.813334-120.96 181.76-4.266667 2.346667a69.76 69.76 0 0 1-104.533333-60.373333V206.933333a69.76 69.76 0 0 1 104.533333-60.373333L800.426667 439.466667a69.546667 69.546667 0 0 1 0 120.746666l-4.266667 2.56-233.386667 14.933334 110.72 192a64 64 0 0 1-23.466666 87.466666l-36.906667 21.333334a65.92 65.92 0 0 1-32 8.32z m-160.213333-298.666667l141.653333 245.12a21.333333 21.333333 0 0 0 13.013333 9.813333 20.053333 20.053333 0 0 0 16-2.133333l37.12-21.333333a21.333333 21.333333 0 0 0 9.813334-12.8 21.333333 21.333333 0 0 0-2.133334-16.213334L490.666667 539.52l291.413333-18.773333a26.666667 26.666667 0 0 0-3.626667-44.16L271.786667 183.68a27.093333 27.093333 0 0 0-40.533334 23.253333v585.813334a26.666667 26.666667 0 0 0 13.653334 23.466666 26.453333 26.453333 0 0 0 23.04 1.92z" p-id="1922" fill="#ffffff"></path></svg>')
    this.installPlugin(p1)
  }

  // 初始化工作台
  initWorkBench() {
    this.workbench = new Workbench(this.workbenchDom.offsetWidth, this.workbenchDom.offsetHeight)
    this.workbenchDom.appendChild(this.workbench.canvas)
  }

  // 添加图片
  addImage(img) {
    if (!this.layers.length) {
      const h = this.workbench.height - 160
      const w = img.width / img.height * h
      this.workbench.updateLayerState(w, h)
    }
    const l = new Layer(img, this.workbench.layerState.w, this.workbench.layerState.h)
    this.layers.push(l)
    this.workbench.appendLayer(l)
  }
}

export default DajevuImageEdit
