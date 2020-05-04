<template>
  <div class="loader">
    <div class="loader-inner ball-scale-multiple">
      <div></div>
      <div></div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { mapGetters } from 'vuex'
import api from '@/api'
import { IS_REQUIRED_LOGIN } from '@/config'
export default {
  name: 'init',
  data () {
    return {
      msg: '正在初始化...'
    }
  },
  computed: {
    ...mapGetters([
      'isLogin'
    ])
  },
  created () {
    // test  校验
    if (this.$route.name === 'init') {
      setTimeout(() => {
        if (this.isLogin || !IS_REQUIRED_LOGIN) {
          router.replace('/console/home')
        } else {
          api.user.login()
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
}
.ball-scale-multiple {
  position: relative;
  -webkit-transform: translateY(-30px);
  -ms-transform: translateY(-30px);
  transform: translateY(-30px);
}
.ball-scale-multiple > div {
  background-color: #67c23a;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  margin: 0;
  width: 60px;
  height: 60px;
  -webkit-animation: ball-scale-multiple 1s 0s linear infinite;
  animation: ball-scale-multiple 1s 0s linear infinite;
}
@keyframes ball-scale-multiple {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}

.ball-scale-multiple > div:nth-child(2) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.ball-scale-multiple > div:nth-child(3) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
</style>
