<template>
  <div class="dashboard-mcontainer">
    <el-upload
      class="upload-demo"
      :show-file-list="false"
      :http-request="fileChange"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <el-button type="primary">上传图片</el-button>
    </el-upload>
    <div>
      <h1>{{ color }}</h1>
      <el-button-group>
        <el-button type="primary" @click="mode = 'move'">Move</el-button>
        <el-button type="primary" @click="mode = 'draw'">Draw</el-button>
        <el-button type="primary" @click="mode = 'select'">Select</el-button>
      </el-button-group>
    </div>
    <canvas id="canvas" width="800" height="500" />
    <img v-if="url" :src="url" alt="" srcset="">
    <el-button type="primary" @click="save">保存帧</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      url: '',
      image: '',
      canvas2: null,
      ctx1: '',
      mode: 'move',
      pos: {},
      isClick: false,
      ctrlClicked: false,
      clickedPos: {
        x: 0,
        y: 0
      },
      currentOrigin: {
        x: 0,
        y: 0
      },
      movedPos: {
        x: 0,
        y: 0
      },
      drawRect: {
        pos: {
          x: 0,
          y: 0
        }
      },
      color: '',
      x: 0,
      y: 0,
      frames: [],
      sprites: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.$getImage(temp.src)
      this.image = temp.image
      localStorage.setItem('image', temp.src)
      this.ctx.drawImage(temp.image, 0, 0)
    },
    async initCanvas() {
      this.canvas = document.getElementById('canvas')
      this.canvas2 = document.getElementById('canvas2')
      this.x = Number(this.canvas.getBoundingClientRect().x).toFixed(0)
      this.y = Number(this.canvas.getBoundingClientRect().y).toFixed(0)
      this.ctx = this.canvas.getContext('2d')
      this.initEvent()
      if (localStorage.getItem('image')) {
        this.image = await this.$getImage(localStorage.getItem('image'))
        this.ctx.drawImage(this.image, 0, 0)
      }
    },
    async getDrawRectImage() {
      const canvas = document.createElement('canvas')
      const imageData = this.ctx.getImageData(this.drawRect.pos.x, this.drawRect.pos.y, this.drawRect.width, this.drawRect.height)
      const bgColorData = this.ctx.getImageData(0, 0, 1, 1)
      this.$removeBgColor(imageData, { r: bgColorData.data[0], g: bgColorData.data[1], b: bgColorData.data[2] })
      const newArr = this.$imageData2Array(imageData, this.drawRect.width)
      const react = this.$getImageMinimumBounds(newArr)
      const w = react.right - react.left; const h = react.bottom - react.top
      console.log(newArr, react)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      const outputImageData = this.ctx.getImageData(this.drawRect.pos.x + react.left, this.drawRect.pos.y + react.top, w, h)
      this.ctx.strokeRect(this.drawRect.pos.x + react.left - 1, this.drawRect.pos.y + react.top - 1, w + 2, h + 2)
      this.$removeBgColor(outputImageData, { r: bgColorData.data[0], g: bgColorData.data[1], b: bgColorData.data[2] })
      ctx.putImageData(outputImageData, 0, 0)
      this.url = canvas.toDataURL('image/png')
      this.sprites.push(
        {
          image: await this.$getImage(this.url),
          width: w,
          height: h
        }
      )
    },
    save() {
      console.log(this.sprites)
      let sumWidth = 0; let maxHeight = 0
      this.sprites.map(function(item, index) {
        sumWidth += item.width
      })
      maxHeight = this.sprites.reduce((item1, item2) => {
        return item1.height > item2.height ? item1 : item2
      }).height
      const canvas = document.createElement('canvas')
      canvas.width = sumWidth
      canvas.height = maxHeight
      const ctx = canvas.getContext('2d')
      let x = 0
      this.sprites.forEach((sprite, index) => {
        sprite.offsetY = maxHeight - sprite.height
        ctx.drawImage(sprite.image, 0, 0, sprite.width, sprite.height, x, sprite.offsetY, sprite.width, sprite.height)
        this.frames.push({
          width: sprite.width,
          height: sprite.height,
          offset_x: x,
          offset_y: sprite.offsetY,
          duration: 100
        })
        x += sprite.width
      })
      const url = canvas.toDataURL('image/png')
      localStorage.setItem('framesCache', JSON.stringify({ frames: this.frames, src: url }))
    },
    initEvent() {
      const that = this
      // this.canvas.addEventListener('wheel', function(event) {
      //   that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height)
      //   if (event.deltaY > 0) {
      //     that.ctx.scale(1.1, 1.1)
      //     that.ctx.drawImage(that.image, 0, 0)
      //   } else {
      //     that.ctx.scale(0.9, 0.9)
      //     that.ctx.drawImage(that.image, 0, 0)
      //   }
      //   event.preventDefault()
      // }, false)
      this.canvas.addEventListener(
        'mousedown',
        function(event) {
          that.clickedPos.x = event.x - that.x
          that.clickedPos.y = event.y - that.y
          that.isClick = true
          event.preventDefault()
        },
        false
      )
      document.addEventListener(
        'mouseup',
        function(event) {
          if (that.isClick && that.mode === 'move') {
            that.currentOrigin = {
              x: that.movedPos.x - that.clickedPos.x + that.currentOrigin.x,
              y: that.movedPos.y - that.clickedPos.y + that.currentOrigin.y
            }
          }
          if (that.isClick && that.mode === 'draw') {
            that.drawRect.pos = {
              x: (that.clickedPos.x < that.movedPos.x
                ? that.clickedPos.x
                : that.movedPos.x) + 1,
              y: (that.clickedPos.y < that.movedPos.y
                ? that.clickedPos.y
                : that.movedPos.y) + 1
            }
            that.drawRect.width = Math.abs(that.movedPos.x - that.clickedPos.x) - 2
            that.drawRect.height = Math.abs(that.movedPos.y - that.clickedPos.y) - 2
            that.getDrawRectImage()
          }
          that.isClick = false
          event.preventDefault()
        },
        false
      )
      this.canvas.addEventListener(
        'mousemove',
        function(event) {
          if (that.isClick) {
            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height)
            that.movedPos = {
              x: event.x - that.x,
              y: event.y - that.y
            }
            if (that.mode === 'draw') {
              that.ctx.save()
              that.ctx.translate(that.currentOrigin.x, that.currentOrigin.y)
              that.ctx.drawImage(that.image, 0, 0)
              that.ctx.restore()
              that.ctx.save()
              that.ctx.lineWidth = 1
              that.ctx.strokeRect(
                that.clickedPos.x < that.movedPos.x
                  ? that.clickedPos.x
                  : that.movedPos.x,
                that.clickedPos.y < that.movedPos.y
                  ? that.clickedPos.y
                  : that.movedPos.y,
                Math.abs(that.movedPos.x - that.clickedPos.x),
                Math.abs(that.movedPos.y - that.clickedPos.y)
              )
              that.ctx.restore()
            } else {
              that.ctx.save()
              that.ctx.translate(
                that.movedPos.x - that.clickedPos.x + that.currentOrigin.x,
                that.movedPos.y - that.clickedPos.y + that.currentOrigin.y
              )
              that.ctx.drawImage(that.image, 0, 0)
              that.ctx.restore()
            }
          }
          if (that.mode === 'select') {
            const imageData = that.ctx.getImageData(event.layerX, event.layerY, 1, 1).data
            that.color = `${imageData[0]},${imageData[1]},${imageData[2]}`
          }
          event.preventDefault()
        },
        false
      )
    }
  }
}
</script>

<style lang="scss" scoped>
canvas {
  margin-top: 20px;
  box-sizing: border-box;
  border: 1px solid grey;
}
</style>
