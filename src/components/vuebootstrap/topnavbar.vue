<template>
  <div class="topnav-div">
    <div>
      <b-navbar toggleable="sm" type="info" class="fixed-top d-flex justify-content-between topnav">
        <b-navbar-nav class="col-11 col-sm-10 col-md-11">
          <searchbar/>
        </b-navbar-nav>
        <b-button :size="updateSize()" class="my-2 my-sm-0 search-btn btn-circle">
          <font-awesome-icon icon="ellipsis-h"/>
        </b-button>        
      </b-navbar>
    </div>    
  </div>
</template>

<script>
import searchbar from "./searchAdressInput.vue"
export default {
  name: 'topnavbar',
  data () {
    return {      
    }
  },
  mounted () {    
    if (window.addEventListener) {
      window.addEventListener("resize", this.updateSize, false);
    } else if (window.attachEvent) {
	    window.attachEvent("onresize", this.updateSize);
    }
  },
  methods : {
    updateSize: function (){                  
      return this.$store.getters.getGridSize();           
    }, 
  },
  components: {
    searchbar
  }
}
</script>      

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.topnav{
  background-color: rgba(255,255,255,0.7);
}
.toggle-font{
  color:black;
}
.search-btn{
  background-color: rgba(0, 60, 136, 0.7);
}
.search-btn:hover{
  background-color: white;
  color:rgba(0, 60, 136, 0.7);
  border-color: rgba(0, 60, 136, 0.7);
}

</style>
