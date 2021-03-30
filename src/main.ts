import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import VueAxios from 'vue-axios'
import LoadScript from 'vue-plugin-load-script'

createApp(App)
    .use(store)
    .use(router)
    .use(LoadScript)
    .use(VueAxios, axios)
    .mount('#app')
