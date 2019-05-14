<template>  
    <b-nav-form class="p-2 col-12">
        <vue-bootstrap-typeahead
          :data="addresses"
          v-model="addressSearch"
          :serializer="s => s.properties.label"
          :placeholder="placeHolder"
          class="search-input col-10 col-sm-10 col-md-11"
          :size="updateSize()"
          @hit="updateBanFeature"
          backgroundVariant='bg-transparent'/>
        <b-button @click="removeFeature" :size="updateSize()" class="my-2 my-sm-0 search-btn" :style="displayBtn">
            <font-awesome-icon icon="times"/>
        </b-button>        
    </b-nav-form> 
</template>

<script>
import { kebabCase, camelCase, debounce } from 'lodash'
import axios from 'axios'

const API_URL = 'https://api-adresse.data.gouv.fr/search/?q=:query'

export default {    
  name: "banbar",
  data() {
    return {
      zoom: 11,
      placeHolder:"Rue des Frères Tilly 22700 Perros-Guirec",
      labels: [],
      isFetching: false,
      addresses: [],
      addressSearch: '',
      displayBtn: {
        display: 'none'
      } 
    }
  },
  mounted () {    
    // event to fire width detection
    if (window.addEventListener) {
      window.addEventListener("resize", this.updateSize, false);
    } else if (window.attachEvent) {
	    window.attachEvent("onresize", this.updateSize);
    }
  },
  watch: {
    // debounce is use to request api
    addressSearch: _.debounce(function(addr) { this.getAddresses(addr) }, 500)
  },
  methods : {
    /**
     * Button event
     * Remove autocomplete results features
     */
    removeFeature: function () {
      this.$store.commit('setBanFeature', {        
      })
      this.displayBtn.display='none'
    },           
    /**
     * We need to get adresse from search input
     * @param query pass by input form select event
     */
    async getAddresses(query) {
      // TODO : manage 40x errors from server side
      this.labels = []
      this.addresses = []
      const res = await fetch(API_URL.replace(':query', query))
      const suggestions = await res.json()
      suggestions.features.forEach((item) => {
        this.addresses.push(item);
        this.labels.push(item.properties.label)
      })
    },     
    /**
     * From selected result we pass the new feature to store
     * @param selected result
     */
    updateBanFeature: function (selected) {      
      if (selected.geometry && this.$store) {
        const xy = selected.geometry.coordinates
        let geom = {
          type: 'Point',
          coordinates: xy,
        }
        // create new feature if necessary
        let feature = []
        // update global store for other components
        this.$store.commit('setBanFeature', {
          features: {
            id: selected.properties.id,
            type: 'Feature',
            geometry: geom,
            properties: selected.properties,
          },
          zoom: this.zoom,
          center: xy
        }) 
        this.displayBtn.display = ""        
      }
    },      
    /**
     * Get size from media width according to bootstrap grid system
     * Update buttons size
     */
    updateSize: function (){      
      return this.$store.getters.getGridSize()      
    },  
  },  
};
</script>

<style lang="scss" scoped>
.search-btn{
  background-color: rgba(0, 60, 136, 0.7);
}
.search-btn:hover{
  background-color: white;
  color:rgba(0, 60, 136, 0.7);
  border-color: rgba(0, 60, 136, 0.7);
}

input {
  background-color: rgba(255,255,255,0);  
}
.search-input {
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
  background-color: rgba(255,255,255,0);  
  border-bottom-color: rgba(0,0,0,0.5);
}
.search-input:focus{
  border-radius:0.2rem;
  border-color: rgba(0,0,0,0);
}
.search-input:focus,.search-btn:focus  {
  box-shadow: 0 0 0 0.2rem rgba(0, 60, 136, 0.4);
}
.search-btn:active{
  background-color: rgba(0, 60, 136, 0.5);
}
</style>