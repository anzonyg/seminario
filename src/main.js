import Vue from 'vue'
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(router)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
