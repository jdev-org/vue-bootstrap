<template>
  <div id="app">    
    <!--router-view/-->
    <topnavbar/>
    <vuemap/>
    <!--logo-->
    <div class="logo-org">
      <a href="http://distillerie-vercors.com">
        <img src="http://distillerie-vercors.com/wp-content/uploads/2018/05/Distillerie_logo_brun_corail-e1527681979704.png"/>
      </a>
    </div>    
  </div>
</template>

<script>
import topnavbar from "./components/vuebootstrap/topnavbar.vue"
import vuemap from "./components/vuelayers/vuemap.vue"
export default {
  name: 'App',
  components: {
    topnavbar,
    vuemap
  }
}
</script>

<style lang="scss">
  @import "../node_modules/bootstrap/scss/bootstrap.scss";

  .logo-org {
    position: fixed;
    bottom: 3%;
    right: 10px;
  }
    
  .logo-org img{
    max-width: 80%;
    float: right;
    width: 50%;
  }  
</style>
