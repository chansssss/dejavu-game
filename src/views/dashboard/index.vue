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
    <div id="image-edit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DajevuImageEdit from '@/libs/dajevu-image-edit'
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {

  },
  async mounted() {
    this.imageEditor = new DajevuImageEdit('image-edit', { width: 1200, height: 600 })
  },
  methods: {
    async fileChange(data) {
      const temp = {
        src: await this.$file2Base(data.file)
      }
      temp.image = await this.$getImage(temp.src)
      this.imageEditor.setImage(temp.image)
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
