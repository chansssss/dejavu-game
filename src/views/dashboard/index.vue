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
    <el-button type="primary" @click="getImgData">ImgDateOut</el-button>

    <div id="image-edit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '../../img-edit/index.css'
import { DajevuImageEdit } from '@/img-edit/index'
export default {
  name: 'Dashboard',
  data() {
    return {
      canvas: null,
      image: null,
      ctx: null
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
  },
  async mounted() {
    this.imageEditor = new DajevuImageEdit('image-edit', { width: 1200, height: 600 })
    this.imageEditor.workbench.ctx.fillStyle = 'green'
    this.imageEditor.workbench.ctx.fillRect(20, 10, 1, 1)
  },
  methods: {
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.$getImage(temp.src)
      this.image = temp.image
      this.imageEditor.addImage(this.image)
    },
    getImgData() {
      console.log(this.imageEditor.workbench.ctx.getImageData(0, 0, 100, 100))
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
