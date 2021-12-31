function getImageMinimumBounds(arr, color = { r: 0, g: 0, b: 0 }) {
  const height = arr.length
  const width = arr[0].length
  let top = 0; let right = width - 1; let bottom = height - 1; let left = 0
  const flags = {
    top: false,
    right: false,
    bottom: false,
    left: false
  }
  while (top <= bottom && (!flags.top || !flags.bottom)) {
    for (let index = 0; index < width; index++) {
      if (!flags.top) {
        const t_color = arr[top][index]
        if (t_color.r !== color.r || t_color.g !== color.g || t_color.b !== color.b) {
          flags.top = true
        }
      }
      if (!flags.bottom) {
        const b_color = arr[bottom][index]
        if (b_color.r !== color.r || b_color.g !== color.g || b_color.b !== color.b) {
          flags.bottom = true
        }
      }
    }
    if (!flags.top) {
      top += 1
    }
    if (!flags.bottom) {
      bottom -= 1
    }
  }
  while (left <= right && (!flags.left || !flags.right)) {
    for (let index = 0; index < height; index++) {
      if (!flags.left) {
        const l_color = arr[index][left]
        if (l_color.r !== color.r || l_color.g !== color.g || l_color.b !== color.b) {
          flags.left = true
        }
      }
      if (!flags.right) {
        const r_color = arr[index][right]
        if (r_color.r !== color.r || r_color.g !== color.g || r_color.b !== color.b) {
          flags.right = true
        }
      }
    }
    if (!flags.left) {
      left += 1
    }
    if (!flags.right) {
      right -= 1
    }
  }
  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left
  }
}

function imageData2Array(imgd, width) {
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

function getImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(img)
    }
  })
}
// 读文件转成base64
function file2Base(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function(e) {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeBgColor(imgd, color) {
  var pix = imgd.data
  var newColor = { r: 0, g: 0, b: 0, a: 0 }
  for (let i = 0, n = pix.length; i < n; i += 4) {
    var r = pix[i]
    var g = pix[i + 1]
    var b = pix[i + 2]
    // If its white then change it
    if (r === color.r && g === color.g && b === color.b) {
      // Change the white to whatever.
      pix[i] = newColor.r
      pix[i + 1] = newColor.g
      pix[i + 2] = newColor.b
      pix[i + 3] = newColor.a
    }
  }
}

export default {
  install: (Vue) => {
    Vue.prototype.$getImageMinimumBounds = getImageMinimumBounds
    Vue.prototype.$imageData2Array = imageData2Array
    Vue.prototype.$getImage = getImage
    Vue.prototype.$file2Base = file2Base
    Vue.prototype.$removeBgColor = removeBgColor
  }
}
