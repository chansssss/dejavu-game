<template>
  <div class="dashboard-container">
    <el-upload
      class="upload-demo"
      :show-file-list="false"
      :http-request="fileChange"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <el-button type="primary">上传图片</el-button>
    </el-upload>
    <canvas id="canvas" width="500" height="500" />
    <img :src="url" alt="" srcset="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      url: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.$getImage(temp.src)
      // 304 224
      const pos = this.getImageMinimumBounds(this.imageData2Array(temp.image))
      const w = pos.right - pos.left
      const h = pos.bottom - pos.top
      const canvas = document.getElementById('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(temp.image, pos.left, pos.top, w, h, 0, 0, w, h)
      this.url = canvas.toDataURL('image/png')
    },
    getImageMinimumBounds(arr) {
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
            if (t_color.r !== 0 || t_color.g !== 0 || t_color.b !== 0) {
              flags.top = true
            }
          }
          if (!flags.bottom) {
            const b_color = arr[bottom][index]
            if (b_color.r !== 0 || b_color.g !== 0 || b_color.b !== 0) {
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
            if (l_color.r !== 0 || l_color.g !== 0 || l_color.b !== 0) {
              flags.left = true
              console.log(index, left)
              console.log(l_color)
            }
          }
          if (!flags.right) {
            const r_color = arr[index][right]
            if (r_color.r !== 0 || r_color.g !== 0 || r_color.b !== 0) {
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
    },
    imageData2Array(image) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.height = image.height
      canvas.width = image.width
      ctx.drawImage(image, 0, 0)
      var imgd = ctx.getImageData(0, 0, image.width, image.height)
      var pix = imgd.data
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
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
