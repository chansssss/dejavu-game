import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
// 读文件转成base64
Vue.prototype.$file2Base = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function(e) {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

Vue.prototype.$getImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(img)
    }
  })
}

Vue.prototype.$getImageMinimumBounds = (arr, color = { r: 0, g: 0, b: 0 }) => {
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
        if (t_color.r !== color.r && t_color.g !== color.g && t_color.b !== color.b) {
          flags.top = true
        }
      }
      if (!flags.bottom) {
        const b_color = arr[bottom][index]
        if (b_color.r !== color.r && b_color.g !== color.g && b_color.b !== color.b) {
          flags.bottom = true
        }
      }
    }
    if (!flags.top) {
      top++
    }
    if (!flags.bottom) {
      bottom--
    }
  }
  while (left <= right && (!flags.left || !flags.right)) {
    for (let index = 0; index < height; index++) {
      if (!flags.left) {
        const l_color = arr[index][left]
        if (l_color.r !== color.r && l_color.g !== color.g && l_color.b !== color.b) {
          flags.left = true
        }
      }
      if (!flags.right) {
        const r_color = arr[index][right]
        if (r_color.r !== color.r && r_color.g !== color.g && r_color.b !== color.b) {
          flags.right = true
        }
      }
    }
    if (!flags.left) {
      left++
    }
    if (!flags.right) {
      right--
    }
  }
  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left
  }
}

Vue.prototype.$imageData2Array = (image) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.height = image.height
  canvas.width = image.width
  ctx.drawImage(image, 0, 0)
  const imgd = ctx.getImageData(0, 0, image.width, image.height)
  const pix = imgd.data
  const newArr = []
  let temp = []
  for (var i = 0, n = pix.length; i < n; i += 4) {
    const color = {
      r: pix[i],
      g: pix[i + 1],
      b: pix[i + 2],
      a: pix[i + 3]
    }
    temp.push(color)
    // eslint-disable-next-line no-unreachable
    if ((/(^[1-9]\d*$)/.test(temp.length / image.width))) {
      newArr.push(temp)
      temp = []
    }
  }
  return newArr
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
