import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        // vue layer feature
        banFeatures: null,
        // get size from screen and return according bootstrap size name
        updateSize: function() {
            let sizeEl = "md";  
            let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if(width <= 576){
              sizeEl = "sm";
            }
            console.log(sizeEl);           

            return sizeEl          
        },
    },
    mutations: {
        /**
         * This mutation is use to create new feature to represent search result geometry
         * @param state 
         * @param banFeatures 
         */
        setBanFeature: function(state,banFeatures) {            
            state.banFeatures = banFeatures
        }
    },
    getters: {
        // same syntax as change function
        getBanFeatures: state => state.banFeatures,
        getGridSize: state => state.updateSize
        
    }
})