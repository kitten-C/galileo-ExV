<template>
  <div class="main">
    <video src="file:///d:/assets/galile-Exv/video_111013.mp4" autoplay loop controls></video>
  </div>
</template>
<script setup>
import config from '../config'
console.log('assetsPath', config.path + '1');


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