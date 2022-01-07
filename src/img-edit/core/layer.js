class Layer {
  constructor(image, width, height) {
    this.image = image
    this.canvas = document.createElement('canvas')
    this.imgScaleX = this.image.width / this.canvas.width
    this.imgScaleY = this.image.height / this.canvas.height
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')
    this.initState()
    this.render()
  }
  initState() {
    this.originX = 0
    this.originY = 0
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    this.ctx.drawImage(this.image, 0, 0)
    this.ctx.restore()
  }
}

export { Layer }
