# vue-bootstrap

A project with vue-botostrap

## Install

### Create project first

```
npm install --save-dev vue-cli vue-cli@next
vue init webpack project-name
cd project-name
```

### Classic NPM Install
_To specify version use this syntax : `npm install bootstrap@4.3.1`_

1. Install dependancies for bootstrap, boostrap-vue and style loaders:
```
npm install bootstrap bootstrap-vue
npm install --save-dev node-sass sass-loader style-loader
```

2. Add bootstrap stylesheet to the **App.vue** file:
```
<style lang="scss">
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
```

3. Add reference to boostrap and bootstrap-vue to the **main.js** file:
```
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
```
4. Install dependancies for vuelayers:
```
npm install --save-dev vuelayers 
npm install --save-dev vuelayers@next
```
5. Add vuelayers to the **App.vue** file:
```import Vue from 'vue'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'
Vue.use(VueLayers)
```
6. Install dependancies for axios:
```
npm install --save-dev axios
```

### Font Awesome
1. Install dependancies
We will install free Font Awesome icons.
So, we need **vue-fontawesome** package to icons:
```
npm install --save @fortawesome/vue-fontawesome
```

2. Install fonts awasome icons as package:
```
npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/free-brands-svg-icons'
```

3. Import all packages in **main.js** file:
```
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// fontawesome
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
```
4. Insert your icon in component or classic html/vue tag
```
<b-button size="sm" variant="outline-success" class="my-2 my-sm-0"><font-awesome-icon icon="bars"/></b-button>
```
Read the doc to get more informations abour font-aweome: 
[fontawesome.com](https://fontawesome.com/how-to-use/with-the-api/setup/library)

[github.com/FortAwesome](https://github.com/FortAwesome/vue-fontawesome)


**Documentation**

[bootstrap-vue](https://bootstrap-vue.js.org/docs)

[vuelayers](https://vuelayers.github.io/#/docs/quickstart)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
