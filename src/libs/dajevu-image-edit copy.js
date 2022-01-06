class DajevuImageEdit {
  constructor(dom, options = {}) {
    if (dom instanceof HTMLElement) {
      this.dom = dom
    } else {
      this.dom = document.getElementById(dom)
    }
    this.mode = 'move'
    this.options = Object.assign({
      width: 500, // 画布宽度
      height: 500,
      control: true
    }, options)
    this.controlMap = {}
    this.objectMap = {}

    this.updateBoxStyle()
    this.createCanvas()
    this.initEvent()
    this.initCanvasState()
  }
  initCanvasState() {
    this.state = {
      moveOriginX: 0, // 拖拽移动的原点x
      moveOriginY: 0, // 拖拽移动的原点y
      mouseMovedX: 0, // 鼠标移动的x点
      mouseMovedY: 0, // 鼠标移动的y点
      mouseClickedX: 0, // 鼠标点击的x点
      mouseClickedY: 0, // 鼠标点击的y点
      originX: 0, // 原点x
      originY: 0, // 原点y
      scaleX: 1,
      scaleY: 1,
      spaceDown: false,
      clickDown: false
    }
  }
  addObject(obj) {
    this.objectMap[genUUID()] = obj
    obj.draw(this.ctx)
  }
  setImage(image) {
    this.image = image
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.image, 0, 0)
  }
  setMode(mode) {
    this.mode = mode
    this.currentControl = this.controlMap[this.mode]
  }
  getMode() {
    return this.mode
  }
  updateBoxStyle() {
    this.dom.style.position = 'relative'
    this.dom.style.height = this.options.height + 'px'
    this.dom.style.width = this.options.width + 'px'
    this.dom.style.border = '1px solid grey'
    this.dom.style.boxSizing = 'border-box'
  }
  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height
    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineWidth = 1
    this.dom.appendChild(this.canvas)
  }
  addControl(mode, control) {
    this.controlMap[mode] = control
  }
  initEvent() {
    this.onKeyDown()
    this.onKeyUp()
    this.mouseUp()
    this.mouseDown()
    this.mouseMove()
    // this.onMouseWheel()
  }
  onKeyDown() {
    document.addEventListener('keydown', event => {
      if (event.key === ' ' && !this.state.spaceDown) {
        this.state.spaceDown = true
        this.updateCursor()
      }
    })
  }
  onMouseWheel() {
    this.canvas.addEventListener(
      'wheel', event => {
        if (event.deltaY < 0) {
          this.state.scaleX += this.state.scaleX * 0.05
          this.state.scaleY += this.state.scaleY * 0.05
        } else {
          this.state.scaleX -= this.state.scaleX * 0.05
          this.state.scaleY -= this.state.scaleY * 0.05
        }
        this.render()
      })
  }
  onKeyUp() {
    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        this.state.spaceDown = false
        this.updateCursor()
      }
    })
  }
  mouseUp() {
    document.addEventListener(
      'mouseup', event => {
        this.state.clickDown = false
        if (this.state.spaceDown) {
          this.updateCursor()
          for (const key in this.objectMap) {
            if (Object.hasOwnProperty.call(this.objectMap, key)) {
              const obj = this.objectMap[key]
              obj._updateOrigin(this.state.mouseMovedX - this.state.mouseClickedX, this.state.mouseMovedY - this.state.mouseClickedY)
            }
          }
        }
      })
  }
  mouseDown() {
    this.canvas.addEventListener(
      'mousedown', event => {
        if (!this.state.clickDown) {
          this.state.clickDown = true
          this.updateCursor()
          this.state.mouseClickedX = event.layerX
          this.state.mouseClickedY = event.layerY
        }
      })
  }
  mouseMove() {
    this.canvas.addEventListener(
      'mousemove', event => {
        this.state.mouseMovedX = event.layerX
        this.state.mouseMovedY = event.layerY
        if (this.state.clickDown && this.state.spaceDown) {
          this.state.moveOriginX = this.state.mouseMovedX - this.state.mouseClickedX
          this.state.moveOriginY = this.state.mouseMovedY - this.state.mouseClickedY
          this.render()
        }
      })
  }
  updateCursor() {
    if (this.state.spaceDown) {
      document.body.style.cursor = 'grab'
    }
    if (this.state.spaceDown && this.state.clickDown) {
      document.body.style.cursor = 'grabbing'
    }
    if (!this.state.spaceDown) {
      document.body.style.cursor = 'default'
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (const key in this.objectMap) {
      if (Object.hasOwnProperty.call(this.objectMap, key)) {
        const obj = this.objectMap[key]
        obj.update(this.state)
        obj.draw(this.ctx)
      }
    }
  }
  drawRect(funcname, args) {

  }
}

class BaseObject {
  constructor(image) {
    this.image = image
    this.originX = 0
    this.originY = 0
  }
  update(state) {
  }
  draw(ctx) {
  }
}

BaseObject.prototype._updateOrigin = function(x, y) {
  this.originX = x + this.originX
  this.originY = y + this.originY
}

class ImageObject extends BaseObject {
  update(state) {
    this.moveOriginX = state.moveOriginX
    this.moveOriginY = state.moveOriginY
    this.scaleX = state.scaleX
    this.scaleY = state.scaleY
  }
  draw(ctx) {
    ctx.save()
    ctx.translate(
      this.originX + this.moveOriginX,
      this.originY + this.moveOriginY
    )
    ctx.scale(this.scaleX, this.scaleY)
    ctx.drawImage(this.image, 0, 0)
    ctx.restore()
  }
}

class BaseControl {
  constructor(editor) {
    this.editor = editor
  }
  onKeyUp() { }
  onKeyDown() { }
  mouseMove() { }
  mouseUp() { }
  mouseDown() { }
  destroy() {

  }
}

class ExtractFramesControl extends BaseControl {
  constructor(editor) {
    super(editor)
    this.obj = ''
  }
  onKeyUp(event) { }
  onKeyDown(event) { }
  mouseMove(event) {
    if (!this.state.spaceDown && this.state.clickDown) {
      this.editor.drawRect('strokeRect', [this.editor.clickedPos.x < this.editor.movedPos.x
        ? this.editor.clickedPos.x
        : this.editor.movedPos.x,
      this.editor.clickedPos.y < this.editor.movedPos.y
        ? this.editor.clickedPos.y
        : this.editor.movedPos.y,
      Math.abs(this.editor.movedPos.x - this.editor.clickedPos.x),
      Math.abs(this.editor.movedPos.y - this.editor.clickedPos.y)])
    }
  }
  mouseUp(event) { }
  mouseDown(event) { }
  destroy() { }
}

function genUUID() {
  const guid = () => {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + '-' + s4()
  }
  return guid()
}

export default DajevuImageEdit

export { DajevuImageEdit, ExtractFramesControl, ImageObject }
