<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <router-link to="/"><a-button type="primary" style="margin: 0 20px">Base版本</a-button></router-link>
  <router-link to="/highlevel"><a-button type="primary" style="margin: 0 20px">高级版本</a-button></router-link>
<!--  <router-link to="/updown"><a-button type="primary" style="margin: 0 20px">文件操作</a-button></router-link>-->
  <a-divider style="height: 2px; background-color: #7cb305" />
  <router-view/>
<!--  <Tablee></Tablee>-->
</template>

<script>
import Tablee from './views/edit_vfor.vue'

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
