<template>
  <div class="sprite-mcontainer">
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
        <img :src="sprite.src" alt="" srcset="">
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
      sprites: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    async flipHorizontally() {
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
    },
    generate() {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      let cwidth = 0; let cheight = 0
      this.sprites.map(function(item, index) {
        cwidth += item.width
      })
      cheight = this.sprites.reduce((item1, item2) => {
        return item1.height > item2.height ? item1.height : item2.height
      })
      canvas.width = cwidth
      canvas.height = cheight
      let x = 0; const y = 0
      this.sprites.forEach((sprite, index) => {
        context.drawImage(sprite.image, x, y, sprite.width, sprite.height)
        x += sprite.width
      })
      this.imgUrl = canvas.toDataURL('image/png')
    },
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.getImage(temp.src)
      temp.image.setAttribute('crossOrigin', 'anonymous')
      temp.width = temp.image.width
      temp.height = temp.image.height
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
