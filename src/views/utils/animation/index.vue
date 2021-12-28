<template>
  <div class="animation-mcontainer">
    <div class="sprite-img-box">
      <img v-if="sprite" :src="sprite.src" alt="" srcset="">
    </div>
    <div class="footer-btn">
      <!-- <el-upload
        :show-file-list="false"
        :http-request="fileChange"
        action="test"
      >
        <el-button type="primary">上传雪碧图</el-button>
      </el-upload> -->
      <!-- <el-button v-if="sprite" type="primary" style="margin-left:10px" @click="frameVisible = true">自动分帧</el-button> -->
      <el-button v-if="frameList.length" type="primary" style="margin-left:10px" @click="showAnimationModel">动画展示</el-button>
    </div>
    <div class="table-box">
      <el-table
        :data="frameList"
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="80"
        />
        <el-table-column
          prop="offset_x"
          label="X轴偏移量"
        />
        <el-table-column
          prop="offset_y"
          label="Y轴偏移量"
        />
        <el-table-column
          prop="duration"
          label="帧持续时长"
        >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.duration" size="mini" :step="100" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="配置" :visible.sync="frameVisible">
      <el-form :model="frame">
        <el-form-item label="每一帧宽度" label-width="120px">
          <el-input v-model="frame.width" autocomplete="off" />
        </el-form-item>
        <el-form-item label="每一帧高度" label-width="120px">
          <el-input v-model="frame.height" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="frameVisible = false">取 消</el-button>
        <el-button type="primary" @click="autoSharding">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="动画展示" :visible.sync="animationVisible">
      <div class="animation">
        <canvas id="my-canvas" width="500" height="500" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="animationVisible = false">取 消</el-button>
        <el-button type="primary" @click="animationVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sprite: {},
      frameList: [],
      frameVisible: false,
      animationVisible: false,
      currentFrame: null,
      currentIndex: 0,
      lasttime: null,
      frame: {
        width: 96,
        height: ''
      }
    }
  },
  created() {
    this.useCache()
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
    autoSharding() {
      const offset = (this.sprite.width / this.frame.width).toFixed(0)
      let offset_x = 0; const offset_y = 0; const duration = 100
      for (let index = 0; index < offset; index++) {
        this.frameList.push({
          width: this.frame.width,
          height: this.frame.height,
          offset_x: offset_x,
          offset_y: offset_y,
          duration: duration
        })
        offset_x += Number(this.frame.width)
      }
      this.frameVisible = false
    },
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.$getImage(temp.src)
      temp.width = temp.image.width
      temp.height = temp.image.height
      this.sprite = temp
      this.frame.height = temp.image.height
    },
    showAnimationModel() {
      this.animationVisible = true
      this.$nextTick(() => {
        this.canvas = document.getElementById('my-canvas')
        this.ctx = this.canvas.getContext('2d')
        this.lasttime = +new Date()
        this.currentFrame = this.frameList[0]
        this.animation()
      })
    },
    getNextIndex() {
      if (this.currentIndex < this.frameList.length) {
        this.currentIndex += 1
      }
      if (this.currentIndex === this.frameList.length - 1) {
        this.currentIndex = 0
      }
      return this.currentIndex
    },
    spriteAnimation() {
      if (+new Date() - this.lasttime >= this.currentFrame.duration) {
        this.lasttime = +new Date()
        this.currentFrame = this.frameList[this.getNextIndex()]
      }
      this.ctx.drawImage(this.sprite.image, this.currentFrame.offset_x, this.currentFrame.offset_y, this.currentFrame.width, this.currentFrame.height, 200, 200 + this.currentFrame.offset_y, this.currentFrame.width, this.currentFrame.height)
    },
    animation() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.spriteAnimation()
      requestAnimationFrame(this.animation)
    }
  }
}
</script>

<style lang="scss" scoped>
.sprite-img-box{
    padding: 20px;
    width: 100%;
    min-height: 50px;
    overflow: auto;
    box-sizing: border-box;
    border: 1px dashed #d9d9d9;
}
.footer-btn{
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
.table-box{
    padding: 10px;
}
</style>
