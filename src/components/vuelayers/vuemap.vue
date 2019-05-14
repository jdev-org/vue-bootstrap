<template>
  <div>
    <vl-map 
    class="map"
    ref="map"
    :load-tiles-while-animating="true" 
    :load-tiles-while-interacting="true" 
    :data-projection="projection"
    >
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>            
      <!-- ban result feature -->
      <vl-layer-vector id="featuresLayer">
        <vl-source-vector ident="featuresSource" :features.sync="getFeatureStore">
        </vl-source-vector>
        <vl-style-box>
          <vl-style-icon :src="banIcon" :scale="0.07"></vl-style-icon>
        </vl-style-box>        
      </vl-layer-vector>
      <vl-interaction-modify source="featuresSource">
      </vl-interaction-modify>
      <!-- // ban result feature -->   
      
      <!-- base layers -->
      <vl-layer-tile v-for="layer in baseLayers" :key="layer.name" :id="layer.name" :visible="layer.visible">
        <component :is="'vl-source-' + layer.name" v-bind="layer"></component>
      </vl-layer-tile>
      <!--// base layers -->

      <!-- other layers from config -->
      <component v-for="layer in layers" :is="layer.cmp" v-if="layer.visible" :key="layer.id" v-bind="layer">
        <!-- add vl-source-* -->
        <component :is="layer.source.cmp" v-bind="layer.source">
          <!-- add static features to vl-source-vector if provided -->
          <vl-feature v-if="layer.source.staticFeatures && layer.source.staticFeatures.length"
                      v-for="feature in layer.source.staticFeatures" :key="feature.id"
                      :id="feature.id" :properties="feature.properties">
            <component :is="geometryTypeToCmpName(feature.geometry.type)" v-bind="feature.geometry"></component>
          </vl-feature>

          <!-- add inner source if provided (like vl-source-vector inside vl-source-cluster) -->
          <component v-if="layer.source.source" :is="layer.source.source.cmp" v-bind="layer.source.source">
            <!-- add static features to vl-source-vector if provided -->
            <vl-feature v-if="layer.source.source.staticFeatures && layer.source.source.staticFeatures.length"
                        v-for="feature in layer.source.source.staticFeatures" :key="feature.id"
                        :id="feature.id" :properties="feature.properties">
              <component :is="geometryTypeToCmpName(feature.geometry.type)" v-bind="feature.geometry"></component>
            </vl-feature>
          </component>
        </component>
        <!--// vl-source-* -->

        <!-- add style components if provided -->
        <!-- create vl-style-box or vl-style-func -->
        <component v-if="layer.style" v-for="(style, i) in layer.style" :key="i" :is="style.cmp" v-bind="style">
          <!-- create inner style components: vl-style-circle, vl-style-icon, vl-style-fill, vl-style-stroke & etc -->
          <component v-if="style.styles" v-for="(st, cmp) in style.styles" :key="cmp" :is="cmp" v-bind="st">
            <!-- vl-style-fill, vl-style-stroke if provided -->
            <vl-style-fill v-if="st.fill" v-bind="st.fill"></vl-style-fill>
            <vl-style-stroke v-if="st.stroke" v-bind="st.stroke"></vl-style-stroke>
          </component>
        </component>
        <!--// style -->
      </component>        
    </vl-map>
  </div>
</template>

<script>
import { createProj, addProj, findPointOnSurface, createStyle } from 'vuelayers/lib/ol-ext'
// openLayers tools
import KML from 'ol/format/KML'
import Style from 'ol/style/Style'  

export default {
  name: "vuemap",
  data() {
    return {
      projection: "EPSG:4326",
      zoom: 2,
      center: [0, 0],
      rotation: 0,
      anchorBan: [0.5, 1],
      banIcon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/390px-Map_marker.svg.png',

      // Add base layers
      baseLayers: [
        {
          name: 'osm',
          title: 'OpenStreetMap',
          visible: true,
        },
        {
          name: 'bingmaps',
          title: 'Bing Maps',
          apiKey: 'ArbsA9NX-AZmebC6VyXAnDqjXk6mo2wGCmeYM8EwyDaxKfQhUYyk0jtx6hX5fpMn',
          imagerySet: 'CanvasGray',
          visible: false,
        },
      ],
      // Add others default layers
      layers: [
        {
          id: 'regionsKml',
          title: 'Régions',
          cmp: 'vl-layer-vector',
          visible: true,
          renderMode: 'image',
          source: {
            cmp: 'vl-source-vector',
            url: './src/assets/data/kml/regions_4326.kml',
            formatFactory: function () {
              return new KML()
            },
          },
        },
        {
          id: 'departementsKml',
          title: 'Départements',
          cmp: 'vl-layer-vector',
          visible: false,
          renderMode: 'image',
          source: {
            cmp: 'vl-source-vector',
            url: './src/assets/data/kml/departements_4326.kml',
            formatFactory: function () {
              return new KML()
            },
          },
        },
        {
          id: 'disitrbution',
          title: 'Points de distribution',
          cmp: 'vl-layer-vector',
          visible: true,
          renderMode: 'image',
          source: {
            cmp: 'vl-source-cluster',
            distance: 50,
            source: {
              cmp: 'vl-source-vector',
              url: './src/assets/data/kml/points_distribution.kml',
              formatFactory: function () {
                return new KML({
                  // deactive default style
                  extractStyles: false,
                })
              },
            },
          },
          style: [
            {
              cmp: 'vl-style-func',
              factory: this.clusterKmlStyleFunc,
            },
          ],
        },
        // Vector layer with clustering
        {
          id: 'cluster',
          title: 'Clients',
          cmp: 'vl-layer-vector',
          renderMode: 'image',
          visible: true,
          // Cluster source (vl-source-cluster) wraps vector source (vl-source-vector)
          source: {
            cmp: 'vl-source-cluster',
            distance: 50,
            source: {
              cmp: 'vl-source-vector',
              url: './src/assets/data/geojson/clients_4326.geojson',
            },
          },
          style: [
            {
              cmp: 'vl-style-func',
              factory: this.clusterStyleFunc,
            },
          ],
        },
      ]

    };
  },
  computed: {
    /**
     * String formatter with kebabCase format
     */
    geometryTypeToCmpName (type) {
      return 'vl-geom-' + kebabCase(type)
    },
    /**
     * Get feature from global store pass by another component
     @return ol feature
     */
    getFeatureStore: function () {      
      if(this.$store.getters.getBanFeatures && this.$store.getters.getBanFeatures.features){
        this.center = this.$store.getters.getBanFeatures.center
        this.zoom = this.$store.getters.getBanFeatures.zoom
        return [this.$store.getters.getBanFeatures.features]
      } else {
        return []
      }      
    }
  },
  methods: {
    /**
     * Set features uses for research into global store
     */
    setBanFeature: function() {
      this.featuresBan = this.$store.getters.getBanFeatures.features
    },    
    /**
     * Cluster layer style function factory for classic vector layers
     * @return {ol.StyleFunction}
     */
    clusterStyleFunc () {
      const cache = {}
      return function __clusterStyleFunc (feature) {
        const size = feature.get('features').length
        let style = cache[size]
        let sizeRules = function (size) {
          if (size === 1) {
            return 10
          } else if (size > 1 && size < 16) {
            return 15
          } else if (size > 15 && size < 31) {
            return 20
          } else if (size > 30 && size < 40) {
            return 25
          } else {
            return 30
          }
        }
        if (!style) {
          if (size > 1) {
            style = createStyle({
              imageRadius: sizeRules(size), // default 10,
              strokeColor: '#fff',
              fillColor: 'rgba(234, 49, 8, 1)',
              text: size.toString(),
              textFillColor: '#fff',
            })
          } else {
            style = createStyle({
              imageSrc: './src/assets/img/star-orange-red-gmap.png',
              imageScale: 0.4,
            })
          }
          cache[size] = style
        }
        return [style]
      }
    },    
    /**
     * Cluster layer style function factory for kml layers
     * @return {ol.StyleFunction}
     */    
    clusterKmlStyleFunc () {
      const cache = {}
      return function __clusterKmlStyleFunc (feature) {
        const size = feature.get('features').length
        let style = cache[size]
        let sizeRules = function (size) {
          if (size === 1) {
            return 10
          } else if (size > 1 && size < 16) {
            return 15
          } else if (size > 15 && size < 31) {
            return 20
          } else if (size > 30 && size < 40) {
            return 25
          } else {
            return 30
          }
        }
        if (!style) {
          if (size > 1) {
            style = createStyle({
              imageRadius: sizeRules(size), // default 10,
              strokeColor: '#fff',
              fillColor: 'rgba(234, 124, 8, 1)',
              text: size.toString(),
              textFillColor: '#fff',
              opacity: 0.5,
            })
          } else {
            style = createStyle({
              imageSrc: './src/assets/img/star-orange-gmap.png',
              imageScale: 0.4,
            })
          }
          cache[size] = style
        }
        return [style]
      }
    }, 
    // base layers   
    showBaseLayer (name) {
      let layer = this.baseLayers.find(layer => layer.visible)
      if (layer != null) {
        layer.visible = false
      }

      layer = this.baseLayers.find(layer => layer.name === name)
      if (layer != null) {
        layer.visible = true
      }
    },  
  }
};
</script>

<style lang="scss">
.ol-zoom {
  bottom: 2.5em;
  left: 1.5em;
  top: auto;
}
</style>