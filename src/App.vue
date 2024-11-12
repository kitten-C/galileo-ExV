<template>
  <div class="main">
    <!-- <video src="/video_111013.mp4" autoplay loop controls></video> -->
    <video :src="args" autoplay loop controls></video>
     {{ args }}
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import config from '../config'
let args = ref()
let videoSrc = ref()

onMounted(() => {
  

})
window.electron.onSetFolderPath((folderPath) => {
  args.value = `file://${folderPath}/video.mp4`
  
  console.log('files', window.electron)
  
})

</script>
<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}

.main {
  height: 100%;
  width: 100%;

  video {
    height: 100%;
    width: 100%;
  }
}
</style>