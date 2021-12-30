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
      <el-button-group>
        <el-button type="primary" icon="el-icon-edit" @click="mode='move'" />
        <el-button type="primary" icon="el-icon-share" @click="mode='draw'" />
      </el-button-group>
    </div>
    <canvas id="canvas" width="800" height="500" />
    <canvas id="canvas2" width="300" height="300" />
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
      x: 0,
      y: 0
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
      console.log(this.canvas.getBoundingClientRect())
      this.x = this.canvas.getBoundingClientRect().x
      this.y = this.canvas.getBoundingClientRect().y
      this.ctx = this.canvas.getContext('2d')
      const ctx2 = this.canvas2.getContext('2d')
      this.initEvent()
      if (localStorage.getItem('image')) {
        this.image = await this.$getImage(localStorage.getItem('image'))
        this.ctx.drawImage(this.image, 0, 0)
        console.log(this.ctx.getImageData(60, 60, 100, 100))
        ctx2.putImageData(this.ctx.getImageData(60, 60, 100, 100), 100, 100)
      }
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
      this.canvas.addEventListener('mousedown', function(event) {
        that.clickedPos.x = event.x - that.x
        that.clickedPos.y = event.y - that.y
        that.isClick = true
        event.preventDefault()
      }, false)
      document.addEventListener('mouseup', function(event) {
        that.isClick = false
        if (that.mode === 'move') {
          that.currentOrigin = {
            x: that.movedPos.x - that.clickedPos.x + that.currentOrigin.x,
            y: that.movedPos.y - that.clickedPos.y + that.currentOrigin.y
          }
        }
        event.preventDefault()
      }, false)
      this.canvas.addEventListener('mousemove', function(event) {
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
            that.ctx.strokeRect(that.clickedPos.x, that.clickedPos.y, Math.abs(that.movedPos.x - that.clickedPos.x), Math.abs(that.movedPos.y - that.clickedPos.y))
          } else {
            that.ctx.save()
            that.ctx.translate(that.movedPos.x - that.clickedPos.x + that.currentOrigin.x, that.movedPos.y - that.clickedPos.y + that.currentOrigin.y)
            that.ctx.drawImage(that.image, 0, 0)
            that.ctx.restore()
          }
        }
        event.preventDefault()
      }, false)
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
