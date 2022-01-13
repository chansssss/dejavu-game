class Workbench {
    canvas
    #edit
    #ctx
    constructor(editInstance, width, height, options) {
      this.#edit = editInstance
      this.modes = ['select']
      this.mode = 'add'
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
      this.gridConf = {
        gridX: 16,
        gridY: 16
      }
      this.gridX = 35
      this.gridY = 35
      this.createCanvas(width, height)
      this.initGrids()
      this.initEvent()
    }
    createCanvas(width, height) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = width
      this.canvas.height = height
      this.ctx = this.canvas.getContext('2d')
    }
    initGrids() {
      this.grids = []
      const h = ((this.canvas.height + this.gridY) / this.gridY).toFixed(0)
      const w = ((this.canvas.width + this.gridX) / this.gridX).toFixed(0)
      for (let i = 0; i < h; i++) {
        this.grids.push([])
        for (let j = 0; j < w; j++) {
          this.grids[i].push(
            new Cell(this.ctx, j * this.gridX, i * this.gridY, this.gridX, this.gridY)
          )
        }
      }
    }

    setMode(mode) {
      this.mode = mode
    }

    addObject() {

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
        event.preventDefault()
      })
    }
    onMouseWheel() {
      this.canvas.addEventListener(
        'wheel', event => {
          if (event.deltaY < 0) {
            this.state.scaleX += 0.1
            this.state.scaleY += 0.1
          } else {
            this.state.scaleX -= 0.1
            this.state.scaleY -= 0.1
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
          if (this.mode === 'add') {
            console.log(this.activeGrid.x)
            this.ctx.drawImage(window.image, this.activeGrid.x, this.activeGrid.y, this.gridX, this.gridY)
            this.activeGrid.update()
          }
        })
    }
    mouseMove() {
      this.canvas.addEventListener(
        'mousemove', event => {
          this.state.mouseMovedX = event.layerX
          this.state.mouseMovedY = event.layerY
          if (this.mode === 'add') {
            if (this.activeGrid) {
              this.activeGrid.hover(false)
              this.activeGrid.render(this.mode)
            }
            this.activeGrid = this.grids[parseInt(this.state.mouseMovedY / this.gridY)][parseInt(this.state.mouseMovedX / this.gridX)]
            this.activeGrid.hover(true)
            this.activeGrid.render(this.mode)
          }
          if (this.state.clickDown && this.state.spaceDown) {
            this.state.moveOriginX = this.state.mouseMovedX - this.state.mouseClickedX
            this.state.moveOriginY = this.state.mouseMovedY - this.state.mouseClickedY
            this.render()
          }
        })
    }
    updateOrigin() {
      this.state.originX += this.state.moveOriginX
      this.state.originY += this.state.moveOriginY
      this.state.moveOriginX = 0
      this.state.moveOriginY = 0
    }
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.save()
      this.ctx.translate(this.state.originX + this.state.moveOriginX, this.state.originY + this.state.moveOriginY)
      this.ctx.scale(this.state.scaleX, this.state.scaleY)
      for (let index = 0; index < this.objs.length; index++) {
        const obj = this.objs[index]
        this.ctx.drawImage(obj.image, this.state.x, this.state.y)
      }
      this.ctx.restore()
    }
}

class Cell {
  constructor(ctx, x, y, w, h) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.imageData = ctx.getImageData(x, y, w, h)
  }
  update() {
    this.imageData = this.ctx.getImageData(this.x, this.y, this.w, this.h)
  }
  render(mode) {
    this.ctx.clearRect(this.x, this.y, this.w, this.h)
    this.ctx.putImageData(this.imageData, this.x, this.y)
    if (this.isHover) {
      if (mode === 'add' && window.image) {
        this.ctx.drawImage(window.image, this.x, this.y, this.w, this.h)
      } else {
        this.ctx.fillStyle = 'rgba(236, 240, 241,.5)'
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
      }
    }
  }
  hover(hovered) {
    this.isHover = hovered
  }
}

export default Workbench
