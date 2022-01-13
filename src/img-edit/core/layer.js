class Layer {
  constructor(image, width, height) {
    this.image = image
    this.imgData = this.getImageData(this.image).data
    // this.imageDataArr = this.imageData2Array(this.imgData, this.image.width)
    this.canvas = document.createElement('canvas')
    this.scaleNum = 1
    this.canvas.width = width * this.scaleNum
    this.canvas.height = height * this.scaleNum
    this.ctx = this.canvas.getContext('2d')
    this.initState()
    this.render()
  }
  initState() {
    this.originX = 0
    this.originY = 0
  }
  scale(num) {
    this.scaleNum = num
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    // this.ctx.scale(this.scaleNum, this.scaleNum)
    // const y = 0; const x = 0
    // for (let i = 0; i < this.imgData.length; i += 4) {
    //   let r = 0; let g = 0; let b = 0
    //   r = this.imgData[i]
    //   g = this.imgData[i + 1]
    //   b = this.imgData[i + 2]
    //   this.ctx.fillStyle = `rgba(${r},${g},${b},255)`
    //   this.ctx.fillRect(x * this.scaleNum, y * this.scaleNum, this.scaleNum, this.scaleNum)
    //   if ((/(^[1-9]\d*$)/.test(i / (this.image.width * 4)))) {
    //     x = 0
    //     y += 1
    //   }
    //   x += 1
    // }
    this.ctx.drawImage(this.image, 0, 0)
    // this.resample_single(this.canvas, this.canvas.width * this.scaleNum, this.canvas.height * this.scaleNum, true)
    this.ctx.restore()
  }
}

Layer.prototype.resample_single = (canvas, width, height, resize_canvas) => {
  var width_source = canvas.width
  var height_source = canvas.height
  width = Math.round(width)
  height = Math.round(height)

  var ratio_w = width_source / width
  var ratio_h = height_source / height
  var ratio_w_half = Math.ceil(ratio_w / 2)
  var ratio_h_half = Math.ceil(ratio_h / 2)

  var ctx = canvas.getContext('2d')
  var img = ctx.getImageData(0, 0, width_source, height_source)
  var img2 = ctx.createImageData(width, height)
  var data = img.data
  var data2 = img2.data

  for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
      var x2 = (i + j * width) * 4
      var weight = 0
      var weights = 0
      var weights_alpha = 0
      var gx_r = 0
      var gx_g = 0
      var gx_b = 0
      var gx_a = 0
      var center_y = (j + 0.5) * ratio_h
      var yy_start = Math.floor(j * ratio_h)
      var yy_stop = Math.ceil((j + 1) * ratio_h)
      for (var yy = yy_start; yy < yy_stop; yy++) {
        var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half
        var center_x = (i + 0.5) * ratio_w
        var w0 = dy * dy // pre-calc part of w
        var xx_start = Math.floor(i * ratio_w)
        var xx_stop = Math.ceil((i + 1) * ratio_w)
        for (var xx = xx_start; xx < xx_stop; xx++) {
          var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half
          var w = Math.sqrt(w0 + dx * dx)
          if (w >= 1) {
            // pixel too far
            continue
          }
          // hermite filter
          weight = 2 * w * w * w - 3 * w * w + 1
          var pos_x = 4 * (xx + yy * width_source)
          // alpha
          gx_a += weight * data[pos_x + 3]
          weights_alpha += weight
          // colors
          if (data[pos_x + 3] < 255) { weight = weight * data[pos_x + 3] / 250 }
          gx_r += weight * data[pos_x]
          gx_g += weight * data[pos_x + 1]
          gx_b += weight * data[pos_x + 2]
          weights += weight
        }
      }
      data2[x2] = gx_r / weights
      data2[x2 + 1] = gx_g / weights
      data2[x2 + 2] = gx_b / weights
      data2[x2 + 3] = gx_a / weights_alpha
    }
  }
  // clear and resize canvas
  if (resize_canvas === true) {
    canvas.width = width
    canvas.height = height
  } else {
    ctx.clearRect(0, 0, width_source, height_source)
  }

  // draw
  ctx.putImageData(img2, 0, 0)
}

Layer.prototype.imageData2Array = (imgd, width) => {
  const pix = imgd.data
  const newArr = []
  let temp = []
  for (let i = 0, n = pix.length; i < n; i += 4) {
    const color = {
      r: pix[i],
      g: pix[i + 1],
      b: pix[i + 2],
      a: pix[i + 3]
    }
    temp.push(color)
    // eslint-disable-next-line no-unreachable
    if ((/(^[1-9]\d*$)/.test(temp.length / width))) {
      newArr.push(temp)
      temp = []
    }
  }
  return newArr
}

Layer.prototype.getImageData = (image) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export { Layer }
