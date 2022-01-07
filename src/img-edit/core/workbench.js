// edit core
class Workbench {
  constructor(width, height) {
    this.width = width
    this.height = height

    // 添加的图层
    this.layers = []
    this.state = {
      x: 0, y: 0,
      originX: 0, originY: 0,
      scaleX: 1, scaleY: 1,
      mouseMoveX: 0, mouseMoveY: 0,
      mouseClickedX: 0, mouseClickedY: 0,
      moveOriginX: 0, moveOriginY: 0,
      spaceDown: false, altDown: false,
      clickDown: false
    }
    this.layerState = {
      w: 400, h: 600
    }
    this.wheelOffset = 50
    this.createWorkbenchDom()

    this.initEvent()
  }

  createWorkbenchDom() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
  }

  updateLayerState(w, h) {
    this.layerState = {
      w: w.toFixed(0), h: h.toFixed(0)
    }
    this.state.originX = (this.width - this.layerState.w * this.state.scaleX) / 2
    this.state.originY = (this.height - this.layerState.h * this.state.scaleY) / 2
  }

  appendLayer(layer) {
    this.layers.push(layer)
    this.render()
  }

  resize(width, height) {
    this.width = width
    this.height = height
    this.render()
  }

  render() {
    this.renderLayer()
  }

  renderLayer() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    this.ctx.translate(this.state.originX + this.state.moveOriginX, this.state.originY + this.state.moveOriginY)
    this.ctx.scale(this.state.scaleX, this.state.scaleY)
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index]
      this.ctx.drawImage(layer.canvas, this.state.x, this.state.y)
    }
    this.ctx.restore()
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
      if (event.key === ' ' && !this.state.spaceDown) {
        this.state.spaceDown = true
        this.updateCursor()
      }
      if (event.key === 'Alt') {
        this.state.altDown = true
      }
    })
  }
  onMouseWheel() {
    this.canvas.addEventListener(
      'wheel', event => {
        if (event.deltaY < 0) {
          if (this.state.altDown) {
            this.state.scaleX += this.state.scaleX * 0.1
            this.state.scaleY += this.state.scaleY * 0.1
            this.state.originX = (this.width - this.layerState.w * this.state.scaleX) / 2
            this.state.originY = (this.height - this.layerState.h * this.state.scaleY) / 2
          } else {
            this.state.originY += this.wheelOffset
          }
        } else {
          if (this.state.altDown) {
            this.state.scaleX -= this.state.scaleX * 0.1
            this.state.scaleY -= this.state.scaleY * 0.1
            this.state.originX = (this.width - this.layerState.w * this.state.scaleX) / 2
            this.state.originY = (this.height - this.layerState.h * this.state.scaleY) / 2
          } else {
            this.state.originY -= this.wheelOffset
          }
        }
        this.render()
      })
  }
  onKeyUp() {
    window.addEventListener('keyup', event => {
      if (event.key === ' ') {
        this.state.spaceDown = false
        this.updateCursor('default')
      }
      if (event.key === 'Alt') {
        this.state.altDown = false
      }
    })
  }
  mouseUp() {
    document.addEventListener(
      'mouseup', event => {
        this.state.clickDown = false
        if (this.state.spaceDown) {
          this.updateOrigin()
          this.updateCursor('grab')
        }
      })
  }
  mouseDown() {
    this.canvas.addEventListener(
      'mousedown', event => {
        if (!this.state.clickDown) {
          this.state.clickDown = true
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

  updateCursor(cursor) {
    document.body.style.cursor = cursor

    // if (this.state.spaceDown) {
    //   document.body.style.cursor = 'grab'
    // }
    // if (this.state.spaceDown && this.state.clickDown) {
    //   document.body.style.cursor = 'grabbing'
    // }
    // if (!this.state.spaceDown) {
    //   document.body.style.cursor = 'default'
    // }
  }

  updateOrigin() {
    this.state.originX += this.state.moveOriginX
    this.state.originY += this.state.moveOriginY
    this.state.moveOriginX = 0
    this.state.moveOriginY = 0
  }
}

export default Workbench

export { Workbench }

