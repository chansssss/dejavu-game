<template>
  <div class="dashboard-mcontainer">
    <canvas id="canvas" width="1000" height="500" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      frameList: [],
      sprite: {},
      g_duration: 1000,
      lasttime: null,
      currentFrame: {}
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {

  },
  async mounted() {
    await this.useCache()
    this.initCanvas()
  },
  methods: {
    async useCache() {
      const cache = JSON.parse(localStorage.getItem('framesCache'))
      if (cache) {
        this.frameList = cache.frames
        this.sprite.src = cache.src
        this.sprite.image = await this.$getImage(cache.src)
        this.sprite.width = this.sprite.image.width
        this.sprite.height = this.sprite.image.height
      }
    },
    createPlayer() {
      this.player = {
        x: 0,
        y: 250,
        statu: 'stop',
        attack: {
          attackNum: this.frameList.length - 1,
          attackMaxNum: this.frameList.length,
          sprite: this.sprite.image,
          frames: this.frameList,

          run: () => {
            if (this.player.attack.attackNum === this.player.attack.attackMaxNum - 1) {
              this.player.statu = 'stop'
              return this.player.attack.frames[0]
            }
            this.player.attack.attackNum += 1
            return this.player.attack.frames[this.player.attack.attackNum]
          }
        }
      }
    },
    async initCanvas() {
      this.createPlayer()
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.animation()
      this.initEvent()
    },
    spriteAnimation() {
      const d = this.g_duration
      if (+new Date() - this.lasttime >= d) {
        this.lasttime = +new Date()
        this.currentFrame = this.player.attack.run()
      }
      this.ctx.drawImage(this.player.attack.sprite, this.currentFrame.offset_x, this.currentFrame.offset_y, this.currentFrame.width, this.currentFrame.height, 200, 200 + this.currentFrame.offset_y, this.currentFrame.width, this.currentFrame.height)
    },
    animation() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.spriteAnimation()
      requestAnimationFrame(this.animation)
    },
    initEvent() {
      const that = this
      console.log(that)
      document.addEventListener('keydown', (event) => {
        if (event.key === 'x' && this.player.statu === 'stop') {
          this.player.statu = 'run'
          this.player.attack.attackNum = 0
        }
      })
      document.addEventListener('keyup', (event) => {
      })
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
