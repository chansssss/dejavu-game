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

    this.updateBoxStyle()
    this.createCanvas()
    this.initEvent()
  }
  addObject(obj) {

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

    this.movedPos = {
      x: 0,
      y: 0
    }
    this.clickedPos = {
      x: 0,
      y: 0
    }
    this.currentOrigin = {
      x: 0,
      y: 0
    }
    this.spaceDown = false
    this.clickDown = false
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
    this.onMouseWheel()
  }
  onKeyDown() {
    document.addEventListener('keydown', event => {
      if (event.key === ' ' && !this.spaceDown) {
        this.spaceDown = true
        this.updateCursor()
      }
    })
  }
  onMouseWheel() {
    this.canvas.addEventListener(
      'wheel', event => {
        console.log(event.deltaY)
      })
  }
  onKeyUp() {
    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        this.spaceDown = false
        this.updateCursor()
      }
    })
  }
  mouseUp() {
    document.addEventListener(
      'mouseup', event => {
        this.clickDown = false
        this.updateCursor()
        this.currentOrigin = {
          x: this.movedPos.x - this.clickedPos.x + this.currentOrigin.x,
          y: this.movedPos.y - this.clickedPos.y + this.currentOrigin.y
        }
      })
  }
  mouseDown() {
    this.canvas.addEventListener(
      'mousedown', event => {
        if (!this.clickDown) {
          this.clickDown = true
          this.updateCursor()
          this.clickedPos = {
            x: event.layerX,
            y: event.layerY
          }
        }
      })
  }
  mouseMove() {
    this.canvas.addEventListener(
      'mousemove', event => {
        this.movedPos = {
          x: event.layerX,
          y: event.layerY
        }
        if (this.clickDown && this.spaceDown) {
          this.moveCanvas()
        }
        // this.currentControl.mouseMove(event)
      })
  }
  updateCursor() {
    if (this.spaceDown) {
      document.body.style.cursor = 'grab'
    }
    if (this.spaceDown && this.clickDown) {
      document.body.style.cursor = 'grabbing'
    }
    if (!this.spaceDown) {
      document.body.style.cursor = 'default'
    }
  }
  moveCanvas() {
    if (this.image) {
      this.ctx.save()
      this.ctx.translate(
        this.movedPos.x - this.clickedPos.x + this.currentOrigin.x,
        this.movedPos.y - this.clickedPos.y + this.currentOrigin.y
      )
      this.ctx.drawImage(this.image, 0, 0)
      this.ctx.restore()
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.imageRender()
  }
  imageRender() {
    if (this.image) {
      this.ctx.save()
      this.ctx.translate(
        this.movedPos.x - this.clickedPos.x + this.currentOrigin.x,
        this.movedPos.y - this.clickedPos.y + this.currentOrigin.y
      )
      this.ctx.drawImage(this.image, 0, 0)
      this.ctx.restore()
    }
  }
  drawRect(funcname, args) {

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
    if (!this.spaceDown && this.clickDown) {
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

export default DajevuImageEdit

export { ExtractFramesControl }
