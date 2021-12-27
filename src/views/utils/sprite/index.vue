<template>
  <div class="sprite-mcontainer">
    <el-button type="primary" style="margin-right:10px" @click="aligning">向下对齐</el-button>
    <div
      class="sprite-list flex-box"
      :style="{ width: '100%', height: '100%' }"
    >
      <div
        v-for="(sprite, index) in sprites"
        :key="index"
        class="sprite-item"
        :style="{ width: sprite.width + 'px', height: sprite.height + 'px' }"
        :title="sprite.width+','+sprite.height"
      >
        <img :src="sprite.src" :style="'margin-top:'+sprite.offsetY+'px'" alt="" srcset="">
      </div>
    </div>
    <div class="footer-btn">
      <a v-if="imgUrl" download="output.jpg" :href="imgUrl" style="margin-right:10px">
        <el-button type="primary">下载</el-button>
      </a>
      <el-button v-if="imgUrl" type="primary" style="margin-right:10px" @click="flipHorizontally">水平翻转</el-button>
      <el-button v-if="sprites.length" type="primary" style="margin-right:10px" @click="generate">生成</el-button>
      <el-upload
        class="upload-demo"
        :show-file-list="false"
        :http-request="fileChange"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <el-button type="primary">上传图片</el-button>
      </el-upload>
    </div>
    <div class="output-img-box">
      <img :src="imgUrl" alt="" srcset="">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      setting: {
        width: 800,
        height: 200
      },
      imgUrl: '',
      sprites: [],
      frames: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    aligning() {
      const maxHeight = this.sprites.reduce((item1, item2) => {
        return item1.height > item2.height ? item1 : item2
      }).height
      console.log(maxHeight)
      for (let index = 0; index < this.sprites.length; index++) {
        const item = this.sprites[index]
        item.offsetY = maxHeight - item.height
      }
    },
    async flipHorizontally() {
      this.frames = this.frames.reverse()
      let offset_x = 0
      for (let index = 0; index < this.frames.length; index++) {
        const item = this.frames[index]
        item.offset_x = offset_x
        offset_x += item.width
      }
      const img = await this.getImage(this.imgUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.translate(img.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(img, 0, 0)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.imgUrl = canvas.toDataURL('image/png')
      localStorage.setItem('framesCache', JSON.stringify({ frames: this.frames, src: this.imgUrl }))
    },
    removeBgColor(image) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      canvas.height = image.height
      canvas.width = image.width
      ctx.drawImage(image, 0, 0)
      var imgd = ctx.getImageData(0, 0, image.width, image.height)
      var pix = imgd.data
      var newColor = { r: 0, g: 0, b: 0, a: 0 }
      for (var i = 0, n = pix.length; i < n; i += 4) {
        var r = pix[i]
        var g = pix[i + 1]
        var b = pix[i + 2]
        // If its white then change it
        if (r === 248 && g === 0 && b === 248) {
          // Change the white to whatever.
          pix[i] = newColor.r
          pix[i + 1] = newColor.g
          pix[i + 2] = newColor.b
          pix[i + 3] = newColor.a
        }
      }
      ctx.putImageData(imgd, 0, 0)
      return canvas.toDataURL('image/png')
    },
    async generate() {
      this.frames = []
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      let cwidth = 0; let cheight = 0
      this.sprites.map(function(item, index) {
        cwidth += item.width
      })
      cheight = this.sprites.reduce((item1, item2) => {
        return item1.height > item2.height ? item1 : item2
      }).height
      canvas.width = cwidth
      canvas.height = cheight
      let x = 0
      this.sprites.forEach((sprite, index) => {
        context.drawImage(sprite.image, x, sprite.offsetY, sprite.width, sprite.height)
        this.frames.push({
          width: sprite.width,
          height: sprite.height,
          offset_x: sprite.offsetX,
          offset_y: sprite.offsetY,
          duration: 100
        })
        x += sprite.width
      })
      // let temp = canvas.toDataURL('image/png')
      const temp = await this.getImage(canvas.toDataURL('image/png'))
      // context.drawImage(this.removeBgColor(temp), 0, 0)
      this.imgUrl = this.removeBgColor(temp)
      localStorage.setItem('framesCache', JSON.stringify({ frames: this.frames, src: this.imgUrl }))
    },
    async fileChange(data) {
      this.sprites = []
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.getImage(temp.src)
      temp.image.setAttribute('crossOrigin', 'anonymous')
      temp.width = temp.image.width
      temp.height = temp.image.height
      temp.offsetY = 0
      temp.offsetX = 0
      this.sprites.push(temp)
    },
    getImage(src) {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = src
        img.onload = () => {
          resolve(img)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    flex: 1;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.sprite-list {
  height: 100%;
  margin-top: 20px;
  max-height: 500px;
  box-sizing: border-box;
  border: 1px dashed #d9d9d9;
  padding: 20px;
  // overflow: auto;
  overflow-x: auto;
  .sprite-item {
    flex-shrink: 0;
    box-sizing: border-box;
      border: 1px dashed #fff;
    &:hover {
      border: 1px dashed #d9d9d9;
    }
    img {
      max-width: 100%;
    }
  }
}
.footer-btn{
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.output-img-box{
  overflow-x: auto;
  padding: 30px;
}
</style>

<style scoped>
.el-upload::v-deep{
  width: 100% !important;
}
.el-upload-dragger::v-deep{
  width: 100% !important;
}
</style>
