import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
});

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', function(orignalDate) {
    const dt = new Date(orignalDate);
    const y = dt.getFullYear();
    const M = (dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
    const d = dt.getDay() < 10 ? '0' + dt.getDay() : dt.getDay();
    const h = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
    const m = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
    return `${y}-${M}-${d} ${h}:${m}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')