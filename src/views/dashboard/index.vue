<template>
  <div class="dashboard-mcontainer">
    <div id="game-edit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import './lib/styles/index.css'
import { GameEditor } from './lib/index'
export default {
  name: 'Dashboard',
  data() {
    return {
      canvas: null,
      image: null,
      gameEditor: null,
      ctx: null
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
  },
  async mounted() {
    this.gameEditor = new GameEditor('game-edit', { width: 1200, height: 600 })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
canvas {
  margin-top: 20px;
  box-sizing: border-box;
  border: 1px solid grey;
}
#game-edit{
  width: 1200px;
  height: 600px;
}
</style>
